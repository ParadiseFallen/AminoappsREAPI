import AminoClient from "../../index"
import AminoMember from "../member/AminoMember"
import AminoCommunity from "../community/AminoCommunity"
import StorageBase from "../storage"
/**
 * Class for storing members objects REWORK!
 */
export default class AminoMemberStorage extends StorageBase<AminoMember> {

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
    public reload(): AminoMemberStorage {

        return this
    }
}
