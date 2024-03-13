function change(value){
    if(Math.floor(value/10)==0) value = '0'+value.toString();
    return value;
}
class MyDate extends Date{
    toLocaleTimeString (){
        var second = change(this.getMinutes());
        var hour = change(this.getHours());
        return `${hour}:${second}`;
    }
    toDate(){
        var date = this.toLocaleDateString().split('/');
        return `${date[2]}-${change(date[0])}-${change(date[1])}`;
    }
    toLocaleTimeStringEnd(hours){
        var second = change(this.getMinutes());
        var hour = change(this.getHours());
        return `${hour}:${second}`;
    }
    toMyLocaleDateString(){
        var date = this.toLocaleDateString().split('/');
        return `${change(date[1])}/${change(date[0])}/${date[2]}`;
    }
}
module.exports = MyDate;