import AminoClient, {
    request,
    IAminoStorage,
    AminoMember,
    AminoCommunity,
    AminoCommentStorage
} from "./../../index"
import {APIEndpoint} from "../APIEndpoint"
import { AminoComponentBase } from "../ComponentModelBase"
import StorageBase from "../storage"
/**
 * Class for working with blogs
 */
export class AminoBlog extends AminoComponentBase{
   
    public id: string
    public title: string
    public content: string
    public viewCount: number
    public votesCount: number
    public commentsCount: number

    public mediaList: Array<string>

    public author: AminoMember

    public community: AminoCommunity
    /**
     * Blog constructor
     * @param {AminoClient} [client] client object
     * @param {AminoCommunity} [community] community object
     * @param {string} [id] blog id
     */
    constructor(client: AminoClient, community: AminoCommunity, id?: string) {
        super(client)
        this.community = community
        this.id = id
    }

    /**
     * Method for getting blog comments
     * @param {number} [start] start position
     * @param {number} [size] count by start
     */
    public getComments(start: number = 1, size: number = 10): AminoCommentStorage {
        
        let response = request("GET", APIEndpoint.compileGetComents(this.id,this.community.id,start,size), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return new AminoCommentStorage(this.client, this.community, this, response.commentList)
    }

    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoBlog {
        let response = request("GET", APIEndpoint.compileGetBlog(this.id,this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })
        return this.setObject(response.blog)
    }

    /**
     * Method for transferring json structure to a blog object
     * @param {any} [object] json community structure
     * @param {AminoMember} [author] blog author object
     */
    setObject(object: any, author?: AminoMember): AminoBlog {
        this.id = object.blogId
        this.title = object.title
        this.content = object.content
        this.viewCount = object.viewCount
        this.votesCount = object.votesCount
        this.commentsCount = object.commentsCount

        this.author = author !== undefined ? author : new AminoMember(this.client, this.community, object.author.uid).refresh()

        if (object.mediaList !== null) {
            this.mediaList = new Array<string>()
            object.mediaList.forEach(struct => {
                this.mediaList.push(struct[1])
            })
        }
        return this
    }
}

/**
 * Class for storing blog objects
 */
export class AminoBlogStorage extends StorageBase<AminoBlog> {
    
    constructor(client: AminoClient, community: AminoCommunity, array?: any) {
        super(client, AminoBlogStorage.prototype)
        if (array) {
            let members: AminoMember[] = community.cache.members.get()
            array.forEach(struct => {
                let member_index: number = members.findIndex(filter => filter.id === struct.author.uid)
                let member: AminoMember
                if (member_index !== -1) {
                    member = members[member_index]
                } else {
                    member = new AminoMember(this.client, community, struct.author.uid).refresh()
                    community.cache.members.push(member)
                    members.push(member)
                }

                this.push(
                    new AminoBlog(this.client, community, struct.blogId).setObject(struct, member)
                )
            })
        }
    }
    protected componentConstructor(client: AminoClient, elementData: any): AminoBlog {
        return null
    }
    
}

