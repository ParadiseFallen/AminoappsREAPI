import { request, requestAsync } from "./components/request"


import EventHandler, { event_type } from "./events/events"
///import components
//community
import AminoCommunity from "./components/community/AminoCommunity"
import AminoCommunityStorage from "./components/community/AminoCommunityStorage"
//member
import AminoMember from "./components/member/AminoMember"
import AminoMemberStorage from "./components/member/AminoMemberStorage"
//chat
import AminoChat, { thread_type } from "./components/chat/AminoChat"
import AminoChatStorage from "./components/chat/AminoChatStorage"
//message
import AminoMessage, { message_type } from "./components/message/AminoMessage"
import AminoMessageStorage from "./components/message/AminoMessageStorage"
//blog
import AminoBlog from "./components/blog/AminoBlog"
import AminoBlogStorage from "./components/blog/AminoBlogStorage"
//comment
import AminoComment from "./components/comment/AminoComment"
import AminoCommentStorage from "./components/comment/AminoCommentStorage"
//utils
import APIEndpoint from "./components/APIEndpoint"
import IAminoCache from "./components/cache"
import StorageBase from "./components/storage"
import AminoComponentBase from "./components/AminoComponentBase"

export {
    request,
    requestAsync,
    IAminoCache,
    StorageBase,
    AminoCommunityStorage,
    AminoCommunity,
    AminoMemberStorage,
    AminoMember,
    AminoChatStorage,
    AminoChat,
    thread_type,
    AminoMessageStorage,
    AminoMessage,
    message_type,
    AminoBlogStorage,
    AminoBlog,
    AminoCommentStorage,
    AminoComment,
    AminoClient,
    APIEndpoint,
    AminoComponentBase
}

/**
 * main class that provide 
 * connection
 * events
 * methods for communities
 */
export default class AminoClient {

    public communities: AminoCommunityStorage
    //current session
    public session: string
    //devideID 
    public device: string

    private _eventHandler: EventHandler
    /**
     * Initialization of the main client
     * @param {string} [login] user login
     * @param {string} [password] user password
     * @param {string} [device] user device id
     */
    constructor(login: string, password: string, device: string) {
        this.device = device
        this.session = request("POST", APIEndpoint.Login, {
            "json": {
                "email": login,
                "secret": "0 " + password,
                "deviceID": this.device,
                "clientType": 100,
                "action": "normal",
                "timestamp": new Date().getTime()
            }
        }).sid
        this.communities = new AminoCommunityStorage(this)
    }

    /**
     * Subscribe to socket events
     * @param event socket event type
     * @param callback any callback
     */
    public onSocketEvent(event: event_type, callback: any) {
        if (this._eventHandler === undefined) {
            this._eventHandler = new EventHandler(this)
        }
        this._eventHandler.on(event, callback)
    }
    /**
     * Subscribe on message event
     * @param callback callback (x:AminoMessage)=>{}
     */
    public onMessage(callback: any) {
        this.onSocketEvent('message', callback)
    } 

    
}
