import AminoClient from "../index";
/**
 * component base
 */
export default abstract class AminoComponentBase {
    /**
     * ref to AminoClient
     */
    protected client: AminoClient

    /**
     *ctor
     */
    constructor(client: AminoClient) {
        this.client = client
    }

    /**
     * All components can update data by request server again
     */
    abstract refresh(): AminoComponentBase
    /**
     * Used by refresh() to set data
     * @param object object with data
     */
    abstract setObject(object: any): AminoComponentBase
}