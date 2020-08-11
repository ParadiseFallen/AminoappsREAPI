import AminoComponentBase from "../AminoComponentBase"
import AminoMember from "../member/AminoMember"
import AminoBlog from "../blog/AminoBlog"
import AminoCommunity from "../community/AminoCommunity"
import AminoClient, { request } from "../../index"
import APIEndpoint from "../APIEndpoint"
import AminoCommentStorage from "./AminoCommentStorage"


/**
 * Class for working with comments
 */
export default class AminoComment extends AminoComponentBase {

    public id: string
    public content: string
    public parentComent : AminoComment
    public author: AminoMember

    public page: AminoBlog | AminoMember
    public community: AminoCommunity
    public subcomments : AminoCommentStorage
    /**
     * Comment constructor
     * @param {AminoClient} [client] client object
     * @param {AminoCommunity} [community] amino community
     * @param {AminoBlog} [page] community page
     * @param {string} [id] comment id
     */
    constructor(client: AminoClient, community: AminoCommunity, page: AminoBlog | AminoMember, id?: string) {
        super(client)
        this.community = community
        this.page = page
        this.id = id
    }
    /**
     * change comment content
     * @param newText 
     */
    public changeText(newText : string) : AminoComment
    {
        let response : any
        if (this.page instanceof AminoMember)
        {
            response = request('POST', APIEndpoint.compileProfileComent(this.community.id, this.author.id) + `/${this.id}`, {
                "headers": {
                    "NDCAUTH": "sid=" + this.client.session,
                },
                "body": JSON.stringify({
                    "content": newText,
                    "timestamp": new Date().getTime()
                })
            })
        }
        if(response)
            this.setObject(response.comment)
        return this
    }
    public setCommentLike(value:number): AminoComment
    {
        let response : any
        if (this.page instanceof AminoMember)
        {
            response = request('POST', APIEndpoint.compileProfileComent(this.community.id, this.author.id) + `/${this.id}/vote`, {
                "headers": {
                    "NDCAUTH": "sid=" + this.client.session,
                },
                "body": JSON.stringify({
                    "value": value,
                    "timestamp": new Date().getTime()
                })
            })
        }
        // if(response)
            // this.setObject(response.comment)
        return this
    }
    /**
     * reply on comment
     * @param content reply text
     */
    public reply(content : string) : AminoComment
    {
        let response : any
        if (this.page instanceof AminoMember)
        {
            response = request('POST', APIEndpoint.compileProfileComent(this.community.id, this.author.id), {
                "headers": {
                    "NDCAUTH": "sid=" + this.client.session,
                },
                "body": JSON.stringify({
                    "content": content,
                    "respondTo" : `${this.id}`,
                    "timestamp": new Date().getTime()
                })
            })
        }
        if(response)
            this.setObject(response.comment)
        return this
    }
    /**
     * Delete comment
     */
    public delete()
    {
        if (this.page instanceof AminoMember)
        {
            request('DELETE', APIEndpoint.compileProfileComent(this.community.id, this.author.id) + `/${this.id}`, {
                "headers": {
                    "NDCAUTH": "sid=" + this.client.session,
                },
            })
        }
    }
    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoComment {
        let response = request("GET", APIEndpoint.compileGetComent(this.id, this.page.id), {
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
    public setObject(object: any, author: AminoMember = undefined, parentComment : AminoComment = undefined): AminoComment {
        this.id = object.commentId
        this.content = object.content
        if(object.subcommentsCount)
            this.subcomments = new AminoCommentStorage(this.client,this.community,this.page,object.subcommentsPreview,this)
        this.parentComent = parentComment

        this.author = author !== undefined ? author : new AminoMember(this.client, this.community, object.author.uid).refresh()
        this.parentComent = parentComment
        return this
    }
}


