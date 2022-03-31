import lowdashGet from 'lodash.get';
import MetadataConfiguration from './metadata_configuration';

class Configuration {
    metadata?: MetadataConfiguration;
    evaluate: boolean;

    constructor({ evaluate = false, metadata }) {
        this.evaluate = evaluate;
        this.metadata = new MetadataConfiguration(metadata);
    }

    get(key: string) {
        return lowdashGet(this, key);
    }
}

export default Configuration;
