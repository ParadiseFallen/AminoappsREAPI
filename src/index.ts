import { request, requestAsync } from "./components/request"
import IAminoCache from "./components/cache"
import StorageBase from "./components/storage"

import EventHandler, { event_type } from "./events/events"

import { AminoCommunity, AminoCommunityStorage as AminoCommunityStorage } from "./components/community/community"
import { AminoMember, AminoMemberStorage } from "./components/member/member"
import { AminoChat, AminoThreadStorage, thread_type } from "./components/chat/chat"
import { AminoMessage, AminoMessageStorage, message_type } from "./components/message/message"
import { AminoBlog, AminoBlogStorage } from "./components/blog/blog"
import { AminoComment, AminoCommentStorage } from "./components/comment/comment"
import { APIEndpoint } from "./components/APIEndpoint"

export {
    request,
    requestAsync,
    IAminoCache,
    StorageBase as IAminoStorage,
    AminoCommunityStorage,
    AminoCommunity,
    AminoMemberStorage,
    AminoMember,
    AminoThreadStorage,
    AminoChat as AminoThread,
    thread_type,
    AminoMessageStorage,
    AminoMessage,
    message_type,
    AminoBlogStorage,
    AminoBlog,
    AminoCommentStorage,
    AminoComment,
    AminoClient,
    APIEndpoint
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
