class MetadataConfiguration {
    separator?: string;

    constructor({ separator } = { separator: null }) {
        this.separator = separator;
    }
}

export default MetadataConfiguration;
