from flask import Blueprint, render_template
from  database.cliente import CLIENTES
cliente_route = Blueprint ('cliente', __name__)

@cliente_route.route ('/')
def lista_clientes ():
    '''listar os clientes'''
    return render_template ('lista_clientes.html', clientes = CLIENTES)

@cliente_route.route ('/', methods=['POST'])
def inserir_clientes ():
    '''inserir dados dos clientes'''
    pass


@cliente_route.route ('/new')
def form_cliente (cliente_id):
    '''formulario para cadastrar um cliente'''
    return render_template ('form_clientes.html')
 
@cliente_route.route ('/<int:cliente_id>')
def detalhe_cliente (cliente_id):
    '''exibir detalhes do cliente'''
    return render_template ('detalhe_clientes.html')

@cliente_route.route ('/<int:cliente_id>/edit')
def form_edit_cliente (cliente_id):
    '''editar um cliente'''
    return render_template ('detalhe_clientes.html')


@cliente_route.route ('/<int:cliente_id>/update', methods=['PUT'])
def update_cliente (cliente_id):
    '''atualiza informações de um cliente'''
    pass


@cliente_route.route ('/<int:cliente_id>/delete', methods=['DELETE'])
def delete_cliente (cliente_id):
    '''deleta informações de um cliente'''
    pass