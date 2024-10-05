import { listProvinsi, listKotaKabupaten } from "../config/IndonesiaProvinciesAndCity.js";

export const getProvincies = (req, res) => {
    res.status(200).json({provincies: listProvinsi})
}

export const getCities = (req, res) => {
    const {provincieId} = req.params
    if(!provincieId) {
        return res.sendStatus(400)
    }

    const citiesInProvincie = listKotaKabupaten.filter(value => value.provinsiId == provincieId)
    if(citiesInProvincie.length < 1) {
        return res.status(404).json({msg: "Kota atau Kabupaten tidak ditemukan!"})
    }

    res.status(200).json(citiesInProvincie)
}