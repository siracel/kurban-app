import axios from "axios";

class KurumService {

    create(payload) {
    }

    update(data) {
        return axios.put(`/kurum/${data._id}`, data);
    }

    get(id) {
        return axios.get(`/kurum/${id}`);
    }
}

export default new KurumService();