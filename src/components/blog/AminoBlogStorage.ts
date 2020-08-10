import AminoClient, { StorageBase, AminoBlog, AminoCommunity, AminoMember } from "../.."

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