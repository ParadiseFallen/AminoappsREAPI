import AminoClient, { StorageBase, AminoMessage, AminoCommunity, AminoMember, AminoChat } from "../.."

/**
 * Class for storing messages objects
 */
export class AminoMessageStorage extends StorageBase<AminoMessage> {
   
    constructor(client: AminoClient, community: AminoCommunity, array?: any) {
        super(client, AminoMessageStorage.prototype)
        if (array) {
            let members: AminoMember[] = community.cache.members.get()
            let threads: AminoChat[] = community.cache.threads.get()
            array.forEach(struct => {
                let member: AminoMember
                let member_index: number = members.findIndex(filter => filter.id === struct.uid)
                if (member_index !== -1) {
                    member = members[member_index]
                } else {
                    member = new AminoMember(this.client, community, struct.uid).refresh()
                    community.cache.members.push(member)
                    members.push(member)
                }

                let thread: AminoChat
                let thread_index: number = threads.findIndex(filter => filter.id === struct.threadId)
                if (thread_index !== -1) {
                    thread = threads[thread_index]
                } else {
                    thread = new AminoChat(this.client, community, struct.threadId).refresh()
                    community.cache.threads.push(thread)
                    threads.push(thread)
                }

                this.push(
                    new AminoMessage(this.client, community).setObject(struct, thread, member)
                )
            })
        }
    }
    protected componentConstructor(client: AminoClient, elementData: any): AminoMessage {
        return null
    }
}

