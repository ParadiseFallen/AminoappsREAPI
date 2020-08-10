import AminoClient, {
    request,
    IAminoStorage,
    AminoThread as AminoChat,
    AminoCommunity,
    AminoBlogStorage
} from "./../../index"
import { APIEndpoint } from "../APIEndpoint"
import { AminoComponentBase } from "../ComponentModelBase"
import { AminoMessage } from "../message/message"
import StorageBase from "../storage"

/**
 * Class for working with members
 */
export class AminoMember extends AminoComponentBase{

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
        
        let response = request("GET", APIEndpoint.compileGetRecentBlogs(this.id,this.community.id,start,size), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return new AminoBlogStorage(this.client, this.community, response.blogList)
    }

    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoMember {
        //maybe need in future to set session
            // "headers": {
            //     "NDCAUTH": "sid=" + this.client.session 
            // }
        let response = request("GET", APIEndpoint.compileProfile(this.community.id,this.id))
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

/**
 * Class for storing members objects REWORK!
 */
export class AminoMemberStorage extends StorageBase<AminoMember> {
    
    constructor(client: AminoClient, community: AminoCommunity, array?: any) {
        super(client, AminoMemberStorage.prototype)
        if (array) {
            let members: AminoMember[] = community.cache.members.get()
            array.forEach(struct => {
                let member_index: number = members.findIndex(filter => filter.id === struct.threadId)
                if (member_index !== -1) {
                    this.push(members[member_index])
                    return
                }

                let member = new AminoMember(this.client, community, struct.uid).setObject(struct)
                this.push(member)
                members.push(member)
                community.cache.members.push(member)
            })
        }
    }
    protected componentConstructor(client: AminoClient, elementData: any): AminoMember {
        return null
    }

    /**
     * Call methods to update in structure objects
     */
    public reload() : AminoMemberStorage {
        
        return this
    }
}

