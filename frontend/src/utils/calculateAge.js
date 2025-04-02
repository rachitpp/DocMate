export default function calculateAge(birthDate, currentDate) {
    try{
        var birthYear = (new Date(birthDate)).getFullYear();
        var currentYear = (new Date()).getFullYear();
        var age = currentYear - birthYear;
        var birthMonth = (new Date(birthDate)).getMonth();
        var currentMonth = (new Date()).getMonth();
        if (currentMonth < (new Date(birthDate)) || (currentMonth === (new Date(birthDate)) && currentDate.getDate() < (new Date(birthDate)).getDate())) {
            age--;
        }
        return age;
    } catch (e){
        console.log(e)
        return 0
    }
}