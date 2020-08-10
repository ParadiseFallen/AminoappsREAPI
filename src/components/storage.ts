import AminoClient, { AminoComponentBase } from "../index"

/**
 * Base class for all storages
 */
export default abstract class StorageBase<T extends AminoComponentBase> extends Array<T> {

    protected client: AminoClient
    /**
     * IAminoStorage<T> constructor
     * @param {AminoClient} [client] amino client
     * @param {any} [prototype] object prototype
     */
    constructor(client: AminoClient, prototype?: any) {
        super()
        this.client = client
        Object.setPrototypeOf(this, prototype)
    }
    /**
     * Construct component from recived data.
     * @param client 
     * @param elementData 
     */
    protected abstract componentConstructor(client: AminoClient, elementData: any): T
    /**
     * Reload all elements with list of data
     * The data must be provided by the inheritor of this class
     */
    public reload(data: any): StorageBase<T> {
        this.length = 0 //clear data
        data.forEach(element => { //every element
            this.push(this.componentConstructor(this.client, element).refresh() as T) //create component based on current data
        })
        return this
    }
    /**
     * refresh data
     */
    public refresh() {
        this.forEach(i => i.refresh())
        return this
    }
}

