import AminoClient from "../../index"
import AminoComponentBase from "../AminoComponentBase"
import AminoMember from "../member/AminoMember"
import AminoMemberStorage from "../member/AminoMemberStorage"
import AminoBlogStorage from "../blog/AminoBlogStorage"
import IAminoCache from "../cache"
import AminoChat from "../chat/AminoChat"
import AminoChatStorage from "../chat/AminoChatStorage"
import APIEndpoint from "../APIEndpoint"
import { request, requestAsync } from "../request"

export declare type blog_type = ('featured-more' | 'featured' | 'blog-all')
export declare type thread_sort = ('recommended' | 'popular' | 'latest')
export declare type thread_type = ('joined-me' | 'public-all')

/**
 * Class for working with communities
 */
export default class AminoCommunity extends AminoComponentBase {

    public id: number

    public icon: string
    public name: string
    public tagline: string
    public description: string
    public membersCount: string

    public invite: string
    public createdTime: string
    public modifiedTime: string

    public keywords: string

    public me: AminoMember
    public creator: AminoMember

    public cache: {
        members: IAminoCache<AminoMember>,
        threads: IAminoCache<AminoChat>
    }

    /**
     * Community constructor
     * @param {AminoClient} [client] client object
     * @param {number} [id] community id
     */
    constructor(client: AminoClient, id: number) {
        super(client)
        this.cache = {
            members: new IAminoCache<AminoMember>(25),
            threads: new IAminoCache<AminoChat>(25)
        }
        this.id = id
    }

    /**
     * Set account nickname
     * @param {string} [nickname] string
     */
    public setNickname(nickname: string) {
        let response = request("POST", APIEndpoint.compileProfile(this.id, this.me.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "body": JSON.stringify({
                "nickname": nickname,
                "timestamp": new Date().getTime()
            })
        })
    }

    /**
     * Set account description
     * @param {string} [description] string
     */
    public async setDescription(description: string): Promise<any> {
        return await requestAsync("POST", APIEndpoint.compileProfile(this.id, this.me.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "body": JSON.stringify({
                "content": description,
                "timestamp": new Date().getTime()
            })
        })
    }

    /**
     * Method for getting the number of users online, as well as objects of the users themselves
     * @param {number} [start] pointer to the starting index to read the list
     * @param {number} [size] number of records to read
     */
    public getOnlineMembers(start: number = 0, size: number = 10): AminoMemberStorage {
        let response = request("GET", APIEndpoint.compileGetOnlineMembers(this.id, start, size), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return new AminoMemberStorage(this.client, this, response.userProfileList)
    }

    /**
     * Method for getting community blogs
     * @param {blog_type} [type] type of blogs
     * @param {number} [start] start position
     * @param {number} [size] number of blogs to read
     */
    public getBlogs(type: blog_type, start: number = 1, size: number = 10): AminoBlogStorage {

        let response = request("GET", APIEndpoint.compileGetBlogs(this.id, type, start, size), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return new AminoBlogStorage(this.client, this, response.blogList)
    }

    /**
     * Method for getting a list of chat threads
     * @param {thread_type} [type] number of records to read
     * @param {number} [start] pointer to the starting index to read the list
     * @param {number} [size] number of records to read
     * @param {thread_sort} [sort] sorting type
     */
    public getChats(type: thread_type, sort: thread_sort = "latest", start: number = 1, size: number = 10): AminoChatStorage {
        let response = request("GET", APIEndpoint.compileGetThreads(this.id, type, sort, start, size), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session,
                "NDCDEVICEID": this.client.device
            }
        })

        return new AminoChatStorage(this.client, this, response.threadList)
    }

    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoCommunity {
        let response = request("GET", APIEndpoint.compileGetCommunity(this.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })
        this.setObject(response)
        return this //Call chain support
    }
    setObject(object: any): AminoCommunity {
        this.icon = object.community.icon
        this.name = object.community.name
        this.tagline = object.community.tagline
        this.description = object.community.content
        this.membersCount = object.community.membersCount

        this.me = new AminoMember(this.client, this, object.currentUserInfo.userProfile.uid).refresh() //why refresh if this new?
        this.creator = new AminoMember(this.client, this, object.community.agent.uid).refresh() //same

        this.invite = object.community.link
        this.createdTime = object.community.createdTime
        this.createdTime = object.community.modifiedTime

        this.keywords = object.community.keywords
        return this //Call chain support
    }
}


