/**
 * DTO class
 * @param constructor props
 */
class DTO {
    constructor(props) {
        this.set(props);
    }

    set(props) {
        if (!props) {
            this.data = {
                status: 'success',
                stream: null,
                error: undefined
            };
        } else {
            this.data = {
                status: props.status ? props.status : 'success',
                stream: props.stream ? props.stream : null,
                error: props.error ? props.error : undefined,
                ...props
            };
        }
        return this.data;
    }

    failed() {
        this.set({status: 'failed'});
        return this.data;
    }

    success() {
        this.set({status: 'success'});
        return this.data;
    }

    error(e) {
        this.set({status: 'failed', stream: null, error: e});
        return this.data;
    }

    stream(data) {
        this.set({status: 'success', stream: data, error: undefined});
        return this.data;
    }

}

module.exports = new DTO();
