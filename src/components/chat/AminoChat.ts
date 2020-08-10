import AminoClient, { AminoComponentBase, AminoMember, AminoCommunity, AminoMessageStorage, APIEndpoint, AminoMessage,request } from "../.."


declare type image_type = ('image/png' | 'image/jpg')

export enum thread_type {
    PRIVATE = 0,
    GROUP = 1,
    PUBLIC = 2
}

/**
 * Class for working with chats
 */
export class AminoChat extends AminoComponentBase {

    public id: any
    public icon: string
    public title: string
    public description: string

    public creator: AminoMember

    public membersQuota: number
    public membersCount: number
    public keywords: any

    public type: thread_type

    public community: AminoCommunity

    /**
     * Thread constructor
     * @param {AminoClient} [client] client object
     * @param {AminoCommunity} [communtity] communtiy object
     * @param {string} [id] thread id
     */
    constructor(client: AminoClient, communtity: AminoCommunity, id?: string) {
        super(client)
        this.community = communtity
        this.id = id
    }

    /**
     * Method for receiving thread messages
     * @param {number} [count] number of messages
     */
    public getMessageList(count: number = 10): AminoMessageStorage {
        
        let response = request("GET", APIEndpoint.compileGetMessageList(this.id,this.community.id,count), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })

        return new AminoMessageStorage(this.client, this.community, response.messageList)
    }

    /**
     * Method for sending text messages to thread
     * @param {string} [content] text to be sent
     * @param {string} [image] path to the image
     */
    public sendMessage(content: string): AminoMessage {
        let response = request("POST", APIEndpoint.compileMessage(this.id,this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "body": JSON.stringify({
                "type": 0,
                "content": content,
                "clientRefId": 827027430,
                "timestamp": new Date().getTime()
            })
        })

        return new AminoMessage(this.client, this.community, this).setObject(response.message, this, this.community.me)
    }

    /**
     * Method for sending text messages to thread
     * @param {string} [content] text to be sent
     * @param {{path: string, link: string }} [image] extension structure
     */
    public sendExtension(content: string, extension: {
        image: Buffer,
        type: image_type,
        link: string
    }): AminoMessage {
        let response = request("POST", APIEndpoint.compileMessage(this.id,this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "body": JSON.stringify({
                "type": 0,
                "content": content,
                "clientRefId": 827027430,
                "timestamp": new Date().getTime(),
                "attachedObject": null,
                "extensions": {
                    "linkSnippetList": [{
                        "link": extension.link,
                        "mediaType": 100,
                        "mediaUploadValue": extension.image.toString("base64"),
                        "mediaUploadValueContentType": extension.type
                    }]
                }
            })
        })

        return new AminoMessage(this.client, this.community, this).setObject(response.message, this, this.community.me) as AminoMessage
    }

    /**
     * Method for sending images to thread
     * @param {string} [image] buffer with image
     * @param {image_type} [type] image type
     */
    public sendImage(image: Buffer, type: image_type): AminoMessage {
        let response = request("POST", APIEndpoint.compileMessage(this.id,this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "body": JSON.stringify({
                "type": 0,
                "content": null,
                "clientRefId": 827027430,
                "timestamp": new Date().getTime(),
                "mediaType": 100,
                "mediaUploadValue": image.toString("base64"),
                "mediaUploadValueContentType": type,
                "mediaUhqEnabled": false,
                "attachedObject": null
            })
        })

        return new AminoMessage(this.client, this.community, this).setObject(response.message, this, this.community.me)
    }

    /**
     * Method for sending audio messages to thread
     * @param {string} [audio] path to audio file
     */
    public sendAudio(audio: Buffer): AminoMessage {
        let response = request("POST", APIEndpoint.compileMessage(this.id,this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            },

            "body": JSON.stringify({
                "type": 2,
                "content": null,
                "clientRefId": 827027430,
                "timestamp": new Date().getTime(),
                "mediaType": 110,
                "mediaUploadValue": audio,
                "attachedObject": null
            })
        })

        return new AminoMessage(this.client, this.community, this).setObject(response.message, this, this.community.me)
    }

    /**
     * Method for join to thread
     */
    public join(): void {
        let response = request("POST", APIEndpoint.compileThreadWithMember(this.id,this.community.id,this.community.me.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })
    }

    /**
     * Method for leaving from thread
     */
    public leave(): void {
        
        let response = request("DELETE", APIEndpoint.compileThreadWithMember(this.id,this.community.id,this.community.me.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })
    }

    /**
     * Method for updating the structure, by re-requesting information from the server
     */
    public refresh(): AminoChat {
        let response = request("GET", APIEndpoint.compileThread(this.id,this.community.id), {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        })
        this.setObject(response.thread)
        return this
    }

    /**
     * Method for transferring json structure to a thread object
     * @param {any} [object] json thread structure
     * @param {AminoMember} [creator] creator object
     */
    setObject(object: any,creator?: AminoMember): AminoChat {
        this.id = object.threadId

        this.icon = object.icon
        this.title = object.title
        this.description = object.content
        this.membersQuota = object.membersQuota
        this.membersCount = object.membersCount
        this.keywords = object.keywords

        this.type = object.type

        this.creator = creator !== undefined ? creator : new AminoMember(this.client, this.community, object.author.uid).refresh()
        return this
    }
}


