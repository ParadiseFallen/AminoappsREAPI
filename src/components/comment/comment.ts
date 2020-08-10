import AminoClient, {
    request,
    IAminoStorage,
    AminoMember,
    AminoCommunity,
    AminoBlog
} from "./../../index"
import {APIEndpoint} from "../APIEndpoint"
import { AminoComponentBase } from "../ComponentModelBase"
import StorageBase from "../storage"
/**
 * Class for working with comments
 */
export class AminoComment extends AminoComponentBase{

    public id: string
    public content: string

    public author: AminoMember

    public blog: AminoBlog
    public community: AminoCommunity
    /**
     * Comment constructor
     * @param {AminoClient} [client] client object
     * @param {AminoCommunity} [community] amino community
     * @param {AminoBlog} [blog] community blog
     * @param {string} [id] comment id
     */
    constructor(client: AminoClient, community: AminoCommunity, blog: AminoBlog, id?: string) {
        super(client)
        this.community = community
        this.blog = blog
        this.id = id
    }

    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoComment {
        let response = request("GET", APIEndpoint.compileGetComent(this.id,this.blog.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return this.setObject(response.comment)
    }

    /**
     * Method for transferring json structure to a comment object
     * @param {any} [object] json community structure
     * @param {AminoMember} [author] comment author object
     */
    public setObject(object: any, author?: AminoMember): AminoComment {
        this.id = object.commentId
        this.content = object.content

        this.author = author !== undefined ? author : new AminoMember(this.client, this.community, object.author.uid).refresh()

        return this
    }
}
/**
 * Class for storing comment objects
 */
export class AminoCommentStorage extends StorageBase<AminoComment> {
    
    constructor(client: AminoClient, community: AminoCommunity, blog: AminoBlog, array?: any) {
        super(client, AminoCommentStorage.prototype)
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
                    new AminoComment(this.client, community, blog, struct.commentId).setObject(struct)
                )
            })
        }
    }
    protected componentConstructor(client: AminoClient, elementData: any): AminoComment {
        return null
    }
}


