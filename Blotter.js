class Blotter {
    constructor(caseNumber, name, address, sex, suspect, date, description){
        this.caseNumber = caseNumber;
        this.name = name;
        this.address = address;
        this.sex = sex.charAt(0).toUpperCase();
        this.suspect = suspect;
        this.date = date;
        this.description = description;
    }
}

class Register {
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
}


class Resident{

    // constructor for the Resident
    constructor(resId,Lname ,Fname ,Mname ,Bday, Age, Gender, civStatus, Address, reli, contactNum, img){

        this.residentId = resId;
        this.lastName = Lname;
        this.firstName = Fname;
        this.middleName = Mname;
        this.birthDate = Bday;
        this.age = Age;
        this.gender = Gender;
        this.civilStatus = civStatus;
        this.address = Address;
        this.religion = reli;
        this.contactNumber = contactNum;
        this.photo = img;
        this.button1 = null;
        this.button2 = null;
        this.button3 = null;
    }

}

