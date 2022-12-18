
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 


const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');


const app = express();
// app.use(bodyParser.json());

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});




app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)
    if(interaction.data.name == 'yo'){
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if(interaction.data.name == 'dm'){
      // https://discord.com/developers/docs/resources/user#create-dm
      let c = (await discord_api.post(`/users/@me/channels`,{
        recipient_id: interaction.member.user.id
      })).data
      try{
        // https://discord.com/developers/docs/resources/channel#create-message
        let res = await discord_api.post(`/channels/${c.id}/messages`,{
          content:'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
        })
        console.log(res.data)
      }catch(e){
        console.log(e)
      }

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content:'👍'
        }
      });
    }
  }

});



app.get('/register_commands', async (req,res) =>{
  let slash_commands = [
    {
      "name": "yo",
      "description": "replies with Yo!",
      "options": []
    },
    {
      "name": "dm",
      "description": "sends user a DM",
      "options": []
    }
  ]
  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      slash_commands
    )
    console.log(discord_response.data)
    return res.send('commands have been registered')
  }catch(e){
    console.error(e.code)
    console.error(e.response?.data)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req,res) =>{
  return res.send('Follow documentation ')
})


app.listen(8999, () => {

})

//____________________________________________________________________________
//Para meter o bot a funcionar escrever 'node .'
//Depois de fazer alterações é preciso gravar antes de correr
//Para voltar a escrever no terminal depois do 'node.' clicar no icone do lixo e puxar de novo a tela para cima

const Discord = require('discord.js');
const bot = new Discord.Client();

//Para ele ir buscar o token noutra pasta (para este não estar aqui):
const config = require('./config.json');



//Aqui é para o bot responder a uma mensagem do chat:
bot.on('message', async message=> {

  //1
    //medida de segurança para o bot não se ler a si próprio
    if(message.author.bot) return;

  //2
    //Crazy Answers (desactivar para ficar mais rápido):
    if(message.content == 'hey bot'){
        message.reply('Did you summon me, master?');
    };
    if(message.content == 'whats nine plus ten' || message.content == 'what is nine plus ten' || message.content == 'whats 9+10' || message.content == 'what is 9+10' ||
    message.content == 'whats nine plus ten?' || message.content == 'what is nine plus ten?' || message.content == 'whats 9+10?' || message.content == 'what is 9+10?' ||
    message.content == 'Whats nine plus ten' || message.content == 'What is nine plus ten' || message.content == 'Whats 9+10' || message.content == 'What is 9+10'){
        message.reply('Twenty one!');
    };
    if(message.content == 'go' || message.content == 'Go'){
      message.reply('...Buah');
    };
    if(message.content == 'deez nuts' || message.content == 'Deez nuts'){
      message.reply('Got eem!');
    };
    if(message.content == 'mipe' || message.content == 'Mipe' || message.content == 'mip' || message.content == 'Mip' || message.content == 'MIPE' || message.content == 'MIP'){
      message.reply('My Masters name is Miguel, please!');
    };

  //3
    //Para o bot ter prefixo e para o ler mesmo tendo outras palavras a seguir na frase:
    if(message.content.indexOf(config.prefix) !== 0) return; //ignores the comments without prefix

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

  //3.1 Testar o bot
    if(command === "bot"){
        message.reply('Did you summon me, master?');
    };


  //3.2 Curiosidades:
    //em vez de tirar daqui as frases tira dum hidden room no discord
    if(command === "trivia" || command === "sabias" || command === "curiosidade" || command === "facto") { 

        var channel = bot.channels.get('504671244164136980'); //  #hidden-content ID
      
          channel.fetchMessages({limit: null})  //the message being fetched limited to any message from the cached list (mas o discord só deixa 100 - ver)
          .then(msg => message.channel.send(`Sabias que ${msg.random().content}?`))   //sendig the message to the channel
          .catch(console.error);
      }

      //3.2.B Opiniões:
    //em vez de tirar daqui as frases tira dum hidden room no discord
    if(command === "opina" || command === "opinion" || command === "opiniao" || command === "opinião") { 

      var channel = bot.channels.get('634428829565452368'); //  #hidden-content ID
    
        channel.fetchMessages({limit: null})  //the message being fetched limited to any message from the cached list (mas o discord só deixa 100 - ver)
        .then(msg => message.channel.send(`${msg.random().content}`))   //sendig the message to the channel
        .catch(console.error);
    }

  //3.3 Caixa Help:
       //1.1definir o channel (tenho de ir buscar o ID do canal, e para isso ver na net como o ir buscar):
   var channel = bot.channels.get('390272847811051522');
       //1.2:
   if(command === "help" || command === 'info'){
      message.channel.send({embed: {
        color: 3447003,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        title: "Info para o peeps:",
        description: "COMANDOS:",
        fields: [
          {
            name: "-sabias",
            value: "Factos do Mundo e Curiosidades sobre o Pessoal",
          },
          {
            name: "-insert",
            value: "Inserir uma Curiosidade na base de dados                                                                                              (Não coloques as palavras `Sabias que` nem o `?` tho)",
          },
          {
            name: "-news",
            value: "Inserir uma notícia na sala 'news' ",
          },
          {
            name: "-dice",
            value: "Jogar Pedra Papel Tesoura",
          },
          {
            name: "-opina",
            value: "Pedir a opinião do bot",
          },
          {
            name: "-help",
            value: "Esta mesma lista de comandos, lel",
          }, 
        ],
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "Qualquer coisa manda mensagem ao Miguel",
        } }  
    });
  }

  //3.4 Fazer o bot dizer algo
  //já está em 3.3 definido o channel. Assim o que escrever noutros channels vai parar ao channel definido

  if(command === "say") { 

    async function clear() {
        var echoMsg = message.content.split('-say ')[1];
        channel.send(echoMsg);
      }
      clear();
    
    message.delete( 50 );    // informa para apagar mensagem após X millisegundos
    }

  //3.5 Comando insert para as curiosidades
  var channel = bot.channels.get('504671244164136980'); //definir o channel das curiosidades que está hidden  

  if(command === 'insert' || command === 'inserir' || command === 'submit' || command === 'submeter' ){

    message.channel.sendMessage('Obrigado por submeteres uma Curiosidade,' + message.author); //responder à pessoa

    async function clear() {
      var echoMsg = message.content.split(command)[1];
      channel.send(echoMsg);
    }
    clear();

    message.delete( 20 );    // informa para apagar mensagem após X millisegundos

  }

  //3.6 Dice:
  if(command === "dice" || command === 'dado' || command === 'pedra papel tesoura') { 

    var channel = bot.channels.get('506952286157668372'); //  #hidden-content ID
  
      channel.fetchMessages({limit: null})
      .then(msg => message.channel.send( `${message.author}${msg.random().content}`))
      .catch(console.error);
  }
   
  //3.7 Comando inserir news
  var channel = bot.channels.get('713032046410334239'); //definir o channel das news  

  if(command === 'news' || command === 'novo' || command === 'n' || command === 'notícias' || command === 'noticias' ){

    message.channel.sendMessage('@everyone, Breaking News!'); //responder à pessoa

    async function clear() {
      var echoMsg = message.content.split(command)[1];
      channel.send(echoMsg);
    }
    clear();

  }





});








//Aqui é para a consola dizer 'Ready' quando o bot estiver pronto:
bot.on('ready',function(){
    console.log('Ready');
});

//Para ele fazer login:
bot.login (process.env.token);

