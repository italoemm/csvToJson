# csvToJson

# Como iniciar
<ul>
  <li>Download Projeto</li>
  <li>Dentro da pasta onde foi salvado o arquivo "digite no Terminal" NPM install</li>
  <li>E apos digite NPM start e será executado</li>
</ul>

# OBSERVACAO PROPRIO:
Gostei do teste! Não diria que foi dificil diria que foi desafiador, no começo eu até pensei ingenuamente "Ah deve ser simples, separar o cabecalho e usar como key em vetor e concatenar com os demais registros do csv e converter para json". No entanto, a maneira na qual deveria ser o output do json, me fez sentir desafiado, pois o csv contia colunas com mesmo nome onde deveria ser concatenados, usuarios que tinha o mesmo registro (nome e ID) onde tambem deveria ser concatenados, registro onde deveriam ser validados e colunas com mais de um nome, contendo virgula dentro e aspas simbolizando que é uma coluna, alem de que algumas colunas poderia conter mais criterios, ou seja, elas deveriam ser dinamicas com possibilidade de mudança no cabeçalho.


# PENSAMENTO LOGICO SIMPLES PARA EFETUAR CODIGO:

•	Efetuar um input do CSV
•	Dividirá as colunas do cabecalho e registros de acordo cada ",".
•	A função tratarCabecalho() validará e irá garantir com que a estrutra do cabecalho não mude, ou seja, o cabecalho que contenha virgula dentro das aspas será mantido.
•	A função concatenarSala() validará e concatenará todas registro que contenha "sala" em apenas 1 coluna mesmo que o proximo registro fosse pertencente da outra coluna "class" 
•	Nas linhas (registros), sera validado cada palavra  e removera os caracteres especial.
•	Apos os registros e as colunas formatados serão concatenados em um vetor.
  o	Cabecalho sendo a Key do vetor "Objetos" e as linhas correspondendo aos valores de cada key.

•	As palavras do cabecalho que contenham "phone" ou "email" serão separados, transformados em vetor e guardados dentro de outro vetor formando assim uma matriz.
  o	"email Resposavel, Pai, Estoque"   -> Matriz "pEmail"[ [email,Responsavel, Pai, Estoque],[],[]...]

•	Sera verificado se a key (cabeçalho) do vetor "Objetos"  é igual algum dos registros da minha matriz, logo eu apenas atribui para a variavel "tag" o vetor da matriz correspondente. 
  o	Tambem sera inserido o valor do objeto atual a variavel "address", esse processo sera efetuado dentro do loop
    	Assim eu consiguirá deixar o cabecalho dinamico exemplo "email, Responsavel, Pai" ou "email, Responsavel, Vó, Contabilidade".

•	Para os demais registros como "full name, eid, invisible..etc" sera feito uma validacao simples.
•	Apos os processos acima serem finalizados será criado objetos de acordo a cada linha (registro) e inseridos dentro de um Array de Objetos!

•	Cada objeto terá seu comportamento:
  o	No metodo converterArrayEmail() sera verificado se o "address" é um vetor, pois quando recebemos o input.csv, pode ser que haverá registro "email@email.com/exemplo@exemplo.com", ou seja no processo anterior de formatar cabeçalho e registro linhas, ao se deparar com esse tipo de registro, sera convertindo em um vetor "["email@email.com","exemplo@exemplo.com"]
	  Sendo assim, metodo ira separar esse vetor em String e ira inserir mais 2 "Address" no objeto e apagará Address que estava com vetor.

  o	No metodo validarRegistro() validará todos os registros tanto email quanto telefone do objeto
    	Removerá todos os Address que sao vazios
    	Email: verificará se o registro é realment um email pelo "REGEX"
    	Telefone: verificará se é telefone é fixo ou celular, verificará se contem DD, verificara se contem somente numero.

  o	No metodo concatenarObjetos() vou verificar se no array de objeto, o objeto atual "this" tem o mesmo nome e id em outro objeto, caso se sim, será inserido no this os "Address" do objeto que esta sendo verificado e o mesmo sera removido do array.

  o	No metodo concatenarEmailcomTag() em vez de ter um Address com a tag "mae" e/ou telefone 551935353535 e um outro Address com "Aluno" e/ou telefone 551935353535 , ou seja, o mesmo telefone,
  será removido um desses Address e retornará um novo Addres com a Tag "Aluno e Mae" 

  o	No metodo retornar() será convertido o Objeto em Json!

  •	Apos os processos acima serem finalixados será exportado Json.
