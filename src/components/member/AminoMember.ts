import AminoClient, { AminoComment } from "../../index"
import AminoComponentBase from "../AminoComponentBase"
import AminoCommunity from "../community/AminoCommunity"
import AminoBlogStorage from "../blog/AminoBlogStorage"
import AminoCommentStorage from "../comment/AminoCommentStorage"
import AminoChat from "../chat/AminoChat"
import APIEndpoint from "../APIEndpoint"
import { request } from "../request"
/**
 * Class for working with members
 */
export default class AminoMember extends AminoComponentBase {

    public id: string
    public icon: string
    public name: string
    public onlineStatus: number
    public membersCount: number
    public reputation: number
    public level: number

    public createdTime: string
    public modifiedTime: string

    public blogsCount: number
    public storiesCount: number

    public community: AminoCommunity

    /**
     * Member constructor
     * @param {AminoClient} [client] client object
     * @param {AminoCommunity} [communtity] communtiy object
     * @param {string} [id] member id
     */
    constructor(client: AminoClient, communtity: AminoCommunity, id?: string) {
        super(client)
        this.community = communtity
        this.id = id
    }

    /**
     * Method for creating a thread to this member
     * @param {string} [initialMessage] initial message for member
     */
    public createChat(initialMessage: string): AminoChat {
        let response = request("POST", APIEndpoint.compileCreateThread(this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "json": {
                "type": 0,
                "inviteeUids": [
                    this.id
                ],
                "initialMessageContent": initialMessage,
                "timestamp": new Date().getTime()
            }
        })

        return new AminoChat(this.client, this.community).setObject(response.thread, this)
    }

    /**
     * Method for getting recent member blogs
     * @param {number} [start] start position
     * @param {number} [size] number of blogs to read
     */
    public getRecentBlogs(start: number = 0, size: number = 10): AminoBlogStorage {

        let response = request("GET", APIEndpoint.compileGetRecentBlogs(this.id, this.community.id, start, size), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return new AminoBlogStorage(this.client, this.community, response.blogList)
    }
    public getComents(): AminoCommentStorage {
        let response = request("GET", APIEndpoint.compileProfileComent(this.community.id, this.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return new AminoCommentStorage(this.client, this.community, this, response.commentList)
    }
    public postComent(messageText : string) :AminoComment {
        let response = request('POST', APIEndpoint.compileProfileComent(this.community.id, this.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session,
            },
            "body": JSON.stringify({
                "content": messageText,
                "timestamp": new Date().getTime()
            })
        })
        return new AminoComment(this.client, this.community, this, response.comment.commentId).setObject(response.comment)
    }
    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoMember {
        //maybe need in future to set session
        // "headers": {
        //     "NDCAUTH": "sid=" + this.client.session 
        // }
        let response = request("GET", APIEndpoint.compileProfile(this.community.id, this.id))
        this.setObject(response.userProfile)
        return this
    }
    /**
     * Method for transferring json structure to a member object
     * @param {any} [object] json member structure
     */
    setObject(object: any): AminoMember {
        this.id = object.uid
        this.icon = object.icon
        this.name = object.nickname
        this.onlineStatus = object.onlineStatus
        this.membersCount = object.membersCount
        this.reputation = object.reputation
        this.level = object.level

        this.createdTime = object.createdTime
        this.modifiedTime = object.modifiedTime

        this.blogsCount = object.blogsCount
        this.storiesCount = object.storiesCount

        return this
    }
}


