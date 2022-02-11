import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Produto } from "./produto.model";

//Tem a responsabilidade de armazenar e recuperar produtos
@Injectable()
export class ProdutosService {
    constructor(
        @InjectModel(Produto)
        private produtoModel: typeof Produto
    ) {}

    async obterTodos(): Promise<Produto[]> {
        return this.produtoModel.findAll();
    }

    async obterUm(id:number): Promise<Produto> {
        return this.produtoModel.findByPk(id);
    }

    async criar(produto:Produto){
        const existingProduct = await this.produtoModel.findOne({
            where: { nome: produto.nome }
        })
        if (existingProduct) {
            throw new HttpException({
                error: 'Já existe um produto com o mesmo nome',
            }, HttpStatus.BAD_REQUEST);
        }
       return this.produtoModel.create(produto)
    }

    async alterar(produto:Produto): Promise<[number,Produto[]]> {
        return this.produtoModel.update(produto, {
            where: {
                id: produto.id
            }
        })
    }

    async apagar(id:number) {
        const produto: Produto = await this.obterUm(id);
        produto.destroy();
    }


}