import moment from 'moment'


export const dateFormat = (date, YYYY = 0) =>{
    if(YYYY === 1)
        return moment(date).format('DD/MM/YYYY')
    else
        return moment(date).format('DD/MM')
}