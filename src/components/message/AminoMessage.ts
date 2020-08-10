import AminoClient from "../../index"
import AminoComponentBase from "../AminoComponentBase"
import AminoCommunity from "../community/AminoCommunity"
import AminoMember from "../member/AminoMember"
import AminoChat from "../chat/AminoChat"
import APIEndpoint from "../APIEndpoint"
import { request } from "../request"

export enum message_type {
    COMMON = 0,
    INVITATION = 103,
    EXIT = 118
}

/**
 * Class for working with messages
 */
export default class AminoMessage extends AminoComponentBase {

    public id: string
    public content: string
    public createdTime: string
    public mediaValue: string

    public type: message_type
    public replyMessage: AminoMessage

    public author: AminoMember
    public thread: AminoChat

    public community: AminoCommunity
    /**
     * Message constructor
     * @param {AminoClient} [client] client object
     * @param {AminoCommunity} [communtity] communtiy object
     * @param {AminoChat} [thread] thread object
     * @param {any} [id] message id
     */
    constructor(client: AminoClient, community: AminoCommunity, thread?: AminoChat, id?: string) {
        super(client)
        this.community = community
        this.thread = thread
        this.id = id
    }

    /**
     * Method for calling the reply message procedure
     * @param {string} [content] text to be sent
     */
    public reply(content: string): AminoMessage {
        let response = request("POST", APIEndpoint.compileMessage(this.thread.id, this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "body": JSON.stringify({
                "replyMessageId": this.id,
                "type": 0,
                "content": content,
                "clientRefId": 827027430,
                "timestamp": new Date().getTime()
            })
        })

        return new AminoMessage(this.client, this.community).setObject(response.message, this.thread, this.community.me)
    }

    /**
     * Method for calling the delete message procedure
     */
    public delete(): void {
        let response = request("DELETE", APIEndpoint.compileMessageWithId(this.id, this.thread.id, this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })
    }

    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoMessage {
        let response = request("GET", APIEndpoint.compileMessageWithId(this.id, this.thread.id, this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })
        this.setObject(response.message)
        return this
    }

    /**
     * Method for transferring json structure to a message object
     * @param {any} [object] json message structure
     * @param {AminoMember} [author] author object
     * @param {AminoChat} [thread] thread object
     */
    setObject(object: any, thread?: AminoChat, author?: AminoMember): AminoMessage {
        this.id = object.messageId
        this.content = object.content
        this.createdTime = object.createdTime
        this.mediaValue = object.mediaValue

        this.type = object.type

        this.author = author !== undefined ? author : new AminoMember(this.client, this.community, object.uid).refresh()
        this.thread = thread !== undefined ? thread : new AminoChat(this.client, this.community, object.threadId).refresh()

        if (object.extensions.replyMessageId !== undefined) {
            this.replyMessage = new AminoMessage(this.client, this.community, this.thread, object.extensions.replyMessageId)
        }
        return this
    }
}


