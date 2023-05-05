import React, {useState} from 'react';
import plusIcon from '../img/plus-svg.svg'
import exitIcon from '../img/exit.svg'
import Message from './Message'
import arrowIcon from '../img/arrow-bottom.svg'

import FileList from './list-components/FileList';
import Modal from '../Modal/Modal';

import '../css/errors.css'
import { Guid } from 'js-guid';


export function Mail(props){
    var bot = props.bot;
    const command_id = props.id;
    const message_index = bot.mail_commands.findIndex(x => x.id === command_id);
    const command_index = bot.commands.findIndex(x => x.id === command_id);
    const last_id = bot.commands[bot.commands.length - 1].id;
    const active_button = props.active_button;

    const [modalActive, setModalActive] = useState(false);
    
    const onChange = (bot) => {
        props.onChangeBot(bot);
    }

    
    const FindMediaCommand = (msg_index) => {
        let medias = [];
        bot.mail_commands[msg_index].media.map((media) =>{
            medias.push({
                name: media.name,
                type: media.type,
                file: media.file
            });
        })
        return medias;
    }
    const [name, setName] = useState(bot.mail_commands[message_index].name);
    const [message, setMessage] = useState(bot.mail_commands[message_index].message);
    const [call_date, setCallDate] = useState(bot.mail_commands[message_index].date);
    const [media, setMedia] = useState(FindMediaCommand(message_index));


    const [new_date_error, setNewDateError] = useState('');

    
    const addBlock = () => {
        if (active_button === "none")
            console.log("Не выбран блок для добавления")
        else if (active_button === "mail")
            console.log("Нельзя добавлять рассылку в это место")
        else if (active_button === "message"){
            let guid = bot.id + Guid.newGuid()
            bot.commands[command_index].link.push(guid);
            bot.commands.push({
                id: guid,
                type: "message",
                call: [],
                link: []
            });
            bot.message_commands.push({
                id: guid,
                name: "Без имени",
                message: "",
                media: []
            })
            console.log("работаем")
            onChange(JSON.parse(JSON.stringify(bot)));
        }
        
    }

    
    const deleteBlock = (cmd_id) => {
        if (bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].link[0] !== null){
            //удаление блоков по ссылкам
            bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].link.map((id) => {
                bot = deleteBlock(id);
            });
        }
        if (bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].type === "message")
            bot.message_commands = bot.message_commands.filter(x => x.id !== cmd_id);
        else if (bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].type === "mail")
            bot.mail_commands = bot.mail_commands.filter(x => x.id !== cmd_id);
        bot.commands = bot.commands.filter(x => x.id !== cmd_id);
        return bot;
    }

    const onDeleteBlock = () => {
        if (props.prev_id !== null)
            //удаление ссылки на блок
            bot.commands[bot.commands.findIndex(x => x.id === props.prev_id)].link = bot.commands[bot.commands.findIndex(x => x.id === props.prev_id)].link.filter(x => x !== command_id);
        bot = deleteBlock(command_id);
        onChange(JSON.parse(JSON.stringify(bot)));
    }

    const changeData = () => {
        let save = true;

        //Здесь должна быть проверка времени
        if (true){

            //это важно
            setNewDateError('Ошибка');
            save = false;
        }
        
        if (save === true){
            bot.mail_commands[message_index].name = name;
            bot.mail_commands[message_index].message = message;
            bot.mail_commands[message_index].date = call_date;
            bot.mail_commands[message_index].media = CreateMediaToChange();
            onChange(bot);
            setNewDateError('');
        }
        
    }
    
    const CreateMediaToChange = () => {
        let files = [];
        media.map((file) => {
            let guid = command_id + Guid.newGuid();
            files.push({
                id: guid,
                name: file.name,
                type: file.type,
                file: file.file
            });
        })
        return files
    }


    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        let files = media;
        console.log("e.target")
        console.log(e.target.files[0])
        files.push({
            name: e.target.files[0].name,
            type: e.target.files[0].type,
            file: base64
        })
        setMedia([...files])
      };
    
      const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };

      const onDeleteMedia = (file) => {
        let medias = media;
        medias.splice(medias.findIndex(x => x.file === file), 1)
        setMedia([...medias])
      }
    
    return(
        <div className='block'>
        <div className="message-block" onClick={() => { setModalActive(true);

                                                        setName(bot.message_commands[message_index].name);
                                                        setMessage(bot.message_commands[message_index].message);
                                                        setCallDate(bot.mail_commands[message_index].date);
                                                        setMedia(FindMediaCommand(message_index));
                                                        setNewDateError('');
                                                        }}>
            <div className="message-field">
                <div>
                    <p className='text-4'>{bot.mail_commands[message_index].name}</p>
                    <a href="#" title='Удалить' className='delete-block-button' onClick={() => onDeleteBlock()}><img src={exitIcon}/></a>
                </div>
                <div className='message-text'><p className='text-5-gray'>{bot.mail_commands[message_index].message !== "" ? bot.mail_commands[message_index].message : "Пустой блок"}</p></div>
            </div>
            <a href="#" title='Добавить' onClick={() => addBlock()} className="add-message-button"><img src={plusIcon} alt="Добавить"/></a>
        </div>
            <div className='inline-bot-block'>
                {bot.commands[command_index].link.map((id) => (
                        id !== null &&
                        bot.commands[bot.commands.findIndex(x => x.id === id)].type === "message" &&
                            <div key={id} className="bot-block">
                            {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.findIndex(x => x === id) === 0 ? 

                                <div className='vertical-line'></div>

                                :
                                null
                            }
                            {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 === bot.commands[command_index].link.findIndex(x => x === id) ? 

                                <div className='vertical-line-opacity'></div>

                                :
                                null
                            }
                            {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 !== bot.commands[command_index].link.findIndex(x => x === id) && bot.commands[command_index].link.findIndex(x => x === id) !== 0 ? 

                                <div className='vertical-line-opacity'></div>

                                :
                                null
                            }
                            {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.findIndex(x => x === id) === 0 ? 
                                <div className='lineToArrow-start'></div>
                                :
                                bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 === bot.commands[command_index].link.findIndex(x => x === id) ?
                                <div className='lineToArrow-end'></div>
                                :
                                bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 !== bot.commands[command_index].link.findIndex(x => x === id) && bot.commands[command_index].link.findIndex(x => x === id) !== 0 && 
                                <div className='lineToArrow'></div>
                            
                            }
                            <img className="imageArrow" src={arrowIcon} alt=''/>
                                <Message 
                                    onChangeBot={onChange} 
                                    bot={bot} 
                                    id={id} 
                                    start_block={true} 
                                    active_button={props.active_button}
                                    prev_id={command_id}/>
                            </div>
                    ))}
                {/* Код для блока подключения человека к чату
                {bot.commands[command_index].link.map((id) => (
                        id !== null &&
                        bot.commands[bot.commands.findIndex(x => x.id === id)].type === "communication" &&
                            
                            <div key={id} className="bot-block">
                                <Communication onChange={onChange} bot={bot} id={id} start_block={false} active_button={props.active_button}/>
                            </div>
                    ))}*/}
            </div>
            {/*Окно настройки блока*/}
            <Modal
                active={modalActive} 
                setActive={setModalActive}>
                <div className='modal-head'>
                    <p className='text-2'>Сообщение</p> 
                    <a onClick={() => {
                        setName(bot.message_commands[message_index].name);
                        setMessage(bot.message_commands[message_index].message);
                        setCallDate(bot.mail_commands[message_index].date);
                        setMedia(FindMediaCommand(message_index));
                        setModalActive(false);
                    }}><img src={exitIcon} alt='Закрыть'/></a>
                </div>
                <hr/>
                <form className='modal-form text-3'>
                    <label htmlFor='name'>Название рассылки</label>
                    <input 
                        className='text-4' 
                        type='text' 
                        id='name' 
                        placeholder='Введите название рассылки' 
                        onChange={e => {setName(e.target.value)}}
                        value={name}
                        />
                    <label htmlFor='message'>Сообщение</label>
                    <textarea 
                        className='message-area text-4' 
                        type='text' 
                        id='message' 
                        placeholder='Введите сообщение' 
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                        />
                    
                    <label htmlFor='date'><p style={{marginTop: '0px', marginBottom: '3px'}}>Дата и время рассылки</p></label>
                        <input 
                            type='datetime-local' 
                            id='date' 
                            value={call_date}
                            onChange={e => setCallDate(e.target.value)}
                        />
                    <div className='error-message text-5'><p style={{color: "red"}}>{new_date_error}</p></div>

                    <label htmlFor='file'><p style={{marginTop: '0px', marginBottom: '3px'}}>Файлы</p></label>
                    {console.log(media)}
                    
                    
                    {modalActive && media.map((obj) => (
                        <div key={obj.name}>
                            <FileList onDelete={onDeleteMedia} file={obj.file} name={obj.name} type={obj.type}/>
                        </div>
                    ))}
                    <input 
                        type='file' 
                        accept='image/*, video/*, application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        onChange={e => uploadImage(e)}>
                    </input>
                    <button onClick={() => changeData()}>Сохранить</button>
                </form>
            </Modal>
        </div>
    );
}

export default Mail