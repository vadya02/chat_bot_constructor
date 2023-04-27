import React from 'react';
import './css/constructor.css'
import Message from './Constructor/Message'
import Mail from './Constructor/Mail'
import plusIcon from './img/plus-svg.svg'

class Constructor extends React.Component{
constructor(props){
    super(props);
    this.links_commands = this.FindFollowLinksCommands(props.bot);
    this.state = {
        bot: props.bot,
        start_commands: this.FindStartCommands(props.bot)
    }

}

Change = (bot) => {
    this.links_commands = this.FindFollowLinksCommands(bot);
    this.setState({
        bot: bot,
        start_commands: this.FindStartCommands(bot)
    });
}

addNewBlock = () => {
    let last_id = this.state.bot.commands[this.state.bot.commands.length - 1].id;
    let bot = JSON.parse(JSON.stringify(this.state.bot));
    if (this.props.active_button === "none")
        console.log("Не выбран блок для добавления")
    else if (this.props.active_button === "mail"){
        bot.commands.push({
            id: last_id + 1,
            type: "mail",
            call: [],
            link: []
        });
        bot.mail_commands.push({
            id: last_id + 1,
            name: "Без имени",
            date: '',
            message: "",
            media: []
        })
        this.setState({
            bot: bot,
            start_commands: this.FindStartCommands(bot)
        })
    }else if (this.props.active_button === "message"){
        bot.commands.push({
            id: last_id + 1,
            type: "message",
            call: [],
            link: []
        });
        bot.message_commands.push({
            id: last_id + 1,
            name: "Без имени",
            message: "",
            media: []
        })
        console.log("работаем")
        this.setState({
            bot: bot,
            start_commands: this.FindStartCommands(bot)
        })
    }
}

SaveBot = () => {
    this.props.onChangeBot(JSON.parse(JSON.stringify(this.state.bot)))
}

FindFollowLinksCommands(bot){
    let commands = [];
        bot.commands.map((command) => {
            if (command !== null && command.link !== null)
                command.link.map((link) => {
                    !commands.includes(link) && commands.push(link)
                });
        });
        
    return commands;
}

FindStartCommands(bot){
    return bot.commands.filter(cmd => cmd !== null && !this.links_commands.includes(cmd.id))
}


    render(){
        return(
            <div className="constructor-block">
                <div className='start-block'>
                    <p className='text-4'>Старт</p>
                </div>
                {this.state.start_commands.map((cmd) => (
                    this.state.bot.commands[this.state.bot.commands.findIndex(x => x.id === cmd.id)].type === "message" &&
                        <div key={cmd.id} className="bot-block">
                            <hr></hr>
                            <Message 
                                onChangeBot={this.Change} 
                                bot={this.state.bot} 
                                id={cmd.id} 
                                start_block={true} 
                                active_button={this.props.active_button}
                                prev_id={null}/>
                        </div>
                ))}
                <hr></hr>
                <div className='add-block-field'>
                    <button><img src={plusIcon} alt="Добавить" onClick={() => this.addNewBlock()}/></button>
                </div>
                <hr></hr>
                <h2 className='text-2'>Рассылки</h2>
                {this.state.start_commands.map((cmd) => (
                    this.state.bot.commands[this.state.bot.commands.findIndex(x => x.id === cmd.id)].type === "mail" &&
                        <div key={cmd.id} className="bot-block">
                            <hr></hr>
                            <Mail 
                                onChangeBot={this.Change} 
                                bot={this.state.bot} 
                                id={cmd.id} 
                                start_block={true} 
                                active_button={this.props.active_button}
                                prev_id={null}/>
                        </div>
                ))}
                <div onClick={() => this.SaveBot()} className='save-button text-2'>Сохранить</div>
            </div>
        );
    }
}

export default Constructor