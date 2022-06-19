# Cadastro de Carro
**Requisitos Funcionais (RF)**
- Deve ser possível cadastrar um carro
- Deve ser possível listar todas as categorias
**Requisitos Não Funcionais (RNF)**

**Requisitos de Negócio (RN)**
- Não deve ser possível cadastrar um carro com uma placa já registrada
- Não deve ser possível alterar a placa de um carro já cadastrado
- O carro deve ser cadastrado de forma a estar disponível para aluguel por padrão
- O carro não pode ser registrado por um usuário que não seja admin

# Listagem de Carros
**Requisitos Funcionais (RF)**
- Deve ser possível listar todos os carros disponíveis
- Deve ser possível listar todos os carros pelo nome da categoria
- Deve ser possível listar todos os carros pelo nome do carro
- Deve ser possível listar todos os carros pelo nome da marca
**Requisitos Não Funcionais (RNF)**

**Requisitos de Negócio (RN)**
- O usuário não precisa estar logado no sistema para visualizar a listagem de carros

# Cadastro de Especificações do Carro
**Requisitos Funcionais (RF)**
- Deve ser possível cadastrar uma especificação para um carro
- Deve ser possível listar todas as especificações
- Deve ser possível listar todos os carros
**Requisitos Não Funcionais (RNF)**

**Requisitos de Negócio (RN)**
- Não deve ser possível cadastrar uma especificação para um carro não cadastrado
- Não deve ser possível cadastrar uma especificação já existente para um mesmo carro
- O usuário que realizará o cadastro deve ser um administrador 

# Cadastro de imagens do carro
**Requisitos Funcionais (RF)**
- Deve ser possível cadastrar a imagem do carro
- Deve ser possível listar todos os carros
**Requisitos Não Funcionais (RNF)**
- Utilizar o multer para upload dos arquivos

**Requisitos de Negócio (RN)**
- O usuário poderá cadastrar mais de uma imagem para o mesmo carro
- O usuário responsável pelo cadastro deve ser um administrador

# Aluguel de carro
**Requisitos Funcionais (RF)**
- Deve ser possível cadastrar um aluguel
**Requisitos Não Funcionais (RNF)**

**Requisitos de Negócio (RN)**
- O Aluguel deve ter duração mínima de 24(vinte e quatro) horas
- Não deve ser possível cadastrar um novo aluguel caso já exista um em aberto para o mesmo usuário
- Não deve ser possível cadastrar um novo aluguel caso já exista um em aberto para o mesmo carro
