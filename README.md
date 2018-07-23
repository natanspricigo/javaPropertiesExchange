# javaPropertiesExchange
Sistema em nodejs que observa uma branch git e troca o .properties java de acordo com um mapa ligando a branch ao arquivo .properties


Modo de uso: 

> Criar uma pasta (qualquer nome), contendo os arquivos .properties usados no sistema.
	Deve conter um arquivo chamado default.properties, onde o mesmo vai ser chamado quando não encontrar um que esta mapeado.

    ex.: default.properties, master.properties, sprint_1.properties ...

> Iniciar o servidor via linha de comando:
	git clone git@github.com:natanspricigo/javaPropertiesExchange.git
	cd javaPropertiesExchange/trocaProperties
	npm start

> Acessar o servidor na porta listada (geralmente 3000): http://localhost:3000/

> Na aba home, localiza-se os links : 
	
	Recarregar arquivos - Recarrega os arquivos .properties, precisa ser executado após a inclusão de um novo arquivo.

	Ver arquivos - Redireciona para uma url com o nome e conteudo dos arquivos utilizados.

> Na aba configuração, encontra-se os seguintes campos:
	
	Caminho do repositorio - Insira o caminho do repositorio(local) git que deseja mapear

	Caminho dos arquivos de propriedade - insira a pasta dos arquivos .properties criada acima

	Caminho da propriedade = caminho da pasta onde localiza-se do arquivo .properties do sistema

	Nome do arquivo de saida - nome do arquivo .properties do sistema

> Na aba Mapa, encontra-se o mapeamento entre uma branch e o arquivo, ao clicar em adicionar, precisamos passar as informações: 
	Nome da branch - nome da brach para mapear 
	Nome do arquivo .properties - nome do arquivo .properties (colocar somente o nome, ex.: master, fast, sprint_1 ...)

> Na aba histórico encontra-se as Branchs trocadas durando o periodo que o servidor ficou ativo, mostrando a data e hora, branch atual e branch antiga.


> Pontos de melhoria: 
- Adiconar testes;
- Melhorar código;
- Melhorar interface;
- Salvar histórico no banco;
- Empacotar aplicação;

