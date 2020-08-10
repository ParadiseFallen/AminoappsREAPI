import AminoClient from "../../index"
import AminoComment from "../comment/AminoComment"
import AminoBlog from "../blog/AminoBlog"
import AminoMember from "../member/AminoMember"
import AminoCommunity from "../community/AminoCommunity"
import StorageBase from "../storage"
/**
 * Class for storing comment objects
 */
export default class AminoCommentStorage extends StorageBase<AminoComment> {

    constructor(client: AminoClient, community: AminoCommunity, page: AminoBlog | AminoMember, array?: any) {
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
                    new AminoComment(this.client, community, page, struct.commentId).setObject(struct)
                )
            })
        }
    }
    protected componentConstructor(client: AminoClient, elementData: any): AminoComment {
        return null
    }
}
