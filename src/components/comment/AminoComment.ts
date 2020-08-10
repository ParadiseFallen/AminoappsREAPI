import AminoClient, { AminoMember, AminoBlog, AminoCommunity, APIEndpoint ,request ,AminoComponentBase} from "../.."

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


