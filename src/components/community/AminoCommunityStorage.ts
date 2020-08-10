import AminoClient from "../../index"
import APIEndpoint from "../APIEndpoint"
import AminoCommunity from "../community/AminoCommunity"
import StorageBase from "../storage"
import { request } from "../request"

/**
 * Class for storing community objects
 * TODO join/leave community
 */
export default class AminoCommunityStorage extends StorageBase<AminoCommunity> {
    /**
     * ctor
     * @param client ref to client
     */
    constructor(client: AminoClient) {
        super(client, AminoCommunityStorage.prototype)
        this.reload()
    }

    protected componentConstructor(client: AminoClient, elementData: any): AminoCommunity {

        return new AminoCommunity(this.client, elementData.ndcId).refresh()
    }
    /**
     * Call methods to update in structure objects
     */
    public reload(): AminoCommunityStorage {
        super.reload(request("GET", APIEndpoint.JoiniedCommunities, {
            "headers": {
                "NDCAUTH": "sid=" + this.client.session
            }
        }).communityList)

        return this
    }
}
