import axios from "axios";

// BüyükBaşKurban
class BKurbanService {
    create(data) {
        return axios.post(`/buyukbas-kurban/${data.project_id}`, data);
    }

    // parametre payload şeklinde tek obj ise -> getAll({kurum_id: kurum._id, project_id: project_id}) şeklinde tek obj içinde gönderilmeli
    getAll(payload) {
        return axios.get(`/buyukbas-kurban/${payload.project_id}`)
    }

    // parametre bu şekilde ise get(direk_id)
    get(id) {
        return axios.get(`/buyukbas-kurban/${id}`);
    }

    // tek bir kurbanı _id ile getir (findSingleBuyukbas -> [kurban] döner)
    getSingle(id) {
        return axios.get(`/buyukbas-kurban/single/${id}`);
    }
    
    getForEkran(payload) {
        return axios.get(`/buyukbas-kurban/process/${payload.kurum_id}/${payload.project_id}/${payload.process_id}/${payload.self}`);
    }
    
    /* For Kurban-Info Page */
    getKurbanInfo(kurban_code) {
        return axios.get(`/user/kurban-info/${kurban_code}`);
    }
    getKurumProcess(kurum_id) {
        return axios.get(`/user/kurban-info-process/${kurum_id}`);
    }
    /* */
    
    update(payload) {
        return axios.put(`/buyukbas-kurban/${payload._id}`, payload);
    }

    changeProcess(payload) {
        return axios.put(`/buyukbas-kurban/change-process/${payload._id}`, payload);
    }

    // yeni sıradaki _id dizisini gönderir; backend kurban_no'yu 1..N yapar
    reorder(items) {
        return axios.put(`/buyukbas-kurban/reorder`, { items });
    }

    upload(payload, id, uploadFileOption) {
        return axios.post(`/buyukbas-kurban/video/${id}`, payload, uploadFileOption);
    }

    uploadImage(payload, id) {
        return axios.post(`/buyukbas-kurban/image/${id}`, payload);
    }

    delete(id) {
        return axios.delete(`/buyukbas-kurban/${id}`);
    }
}

export default new BKurbanService();