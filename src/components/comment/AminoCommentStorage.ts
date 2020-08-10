import AminoClient, { StorageBase, AminoComment, AminoCommunity, AminoBlog, AminoMember } from "../.."

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
