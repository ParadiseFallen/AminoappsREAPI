import AminoClient, { StorageBase, AminoChat, AminoCommunity, AminoMember } from "../.."

/**
 * Class for storing thread objects
 */
export class AminoChatStorage extends StorageBase<AminoChat> {
    
    constructor(client: AminoClient, community: AminoCommunity, array?: any) {
        super(client, AminoChatStorage.prototype)
        if (array) {
            let threads: AminoChat[] = community.cache.threads.get()
            let members: AminoMember[] = community.cache.members.get()
            array.forEach(struct => {
                let thread_index: number = threads.findIndex(filter => filter.id === struct.threadId)
                if (thread_index !== -1) {
                    this.push(threads[thread_index])
                    return
                }

                let member_index: number = members.findIndex(filter => filter.id === struct.author.uid)
                let member: AminoMember
                if (member_index !== -1) {
                    member = members[member_index]
                } else {
                    member = new AminoMember(this.client, community, struct.author.uid).refresh()
                    community.cache.members.push(member)
                    members.push(member)
                }

                let thread = new AminoChat(this.client, community, struct.threadId).setObject(struct, member) as AminoChat
                this.push(thread)
                threads.push(thread)
                community.cache.threads.push(thread)
            })
        }
    }
    protected componentConstructor(client: AminoClient, elementData: any): AminoChat {
        return null
    }
}