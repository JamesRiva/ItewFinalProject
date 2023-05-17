
$(document).ready(function(){

    let firstName = document.getElementById("txtFirstName"); 
    let lastName = document.getElementById("txtLastName");
    let middleInitial = document.getElementById("txtMiddleInitial");
    let address = document.getElementById("txtAddress");
    let sex = document.getElementById("txtSex");     
    let suspectLastName = document.getElementById("txtSuspectLast");
    let suspectFirstName = document.getElementById("txtSuspectFirst");
    let suspectMiddleName = document.getElementById("txtSuspectMiddle");
    let date = document.getElementById("txtIncidentDate");
    let description = document.getElementById("txtDescription");   
    let arrBlotterRecords = [];
    let adminAccount = ['admin', 'admin'];
    let arrAccounts = [];
    let tblResidents = document.getElementById('tblResident');
    let residentList = [];

    $(".container").hide();
    $("#section-register").hide();

    loadDefaults();
    
        $("#btnSubmit").click(function(){     
            if(generalChecking(lastName.value) && generalChecking(firstName.value) && generalChecking(middleInitial.value) && checkingForBlankFields(address.value) && generalChecking(sex.value) && generalChecking(suspectLastName.value) && generalChecking(suspectFirstName.value) && generalChecking(suspectMiddleName.value) && checkingForBlankFields(date.value) && checkingForBlankFields(description.value)){
                
                let fullName = `${capitalizeName(lastName.value)}, ${capitalizeName(firstName.value)}, ${capitalizeName(middleInitial.value)}`;
                let suspectName = `${capitalizeName(suspectLastName.value)}, ${capitalizeName(suspectFirstName.value)}, ${capitalizeName(suspectMiddleName.value)}`;
                let middle = middleInitial.value.charAt(0).toUpperCase();

                let idCaseNumber = Number(localStorage.getItem('caseNumber'));
                let newBlotter = new Blotter (idCaseNumber, fullName, address.value, sex.value, suspectName, date.value, description.value);
                arrBlotterRecords.push(newBlotter);

                localStorage.setItem('tblBlotter', JSON.stringify(arrBlotterRecords));
                displayTableBlotter();

                idCaseNumber++;
                localStorage.setItem('caseNumber', idCaseNumber);
                clearFields();

                $('#section1').hide();
                $('#section3').hide();
                $('#section2').show();
            }           
        });

    $('#accountSection').click(function(){
        $('#containerResidents').show();
        $('#section1').hide();
        $('#section3').hide();
        $('#section2').hide();
    })

    $("#hrefSection1").click(function(){
        $('#section-generateReport').hide();
        $('#section1').show();
        $('#section3').hide();
        $('#section2').hide();

    });

    $("#hrefSection2").click(function(){
        $('#section-generateReport').hide();
        $('#section1').hide();
        $('#section3').hide();
        $('#section2').show();
    });

    $("#hrefSection3").click(function(){
        $('#section-generateReport').hide();  
        $('#section1').hide();
        $('#section2').hide();
        $('#section3').show();
    });

    $("#btnCreateBlotterReport").click(function(){      
        $('#section2').hide();
        $('#section3').hide();
        $('#section1').show();
    });

    $("#btnBlotterReport").click(function(){      
        $('#section-generateReport').hide();
        $('#section3').show();
    });

    $("#hrefLogin").click(function(){      
        $('#section-register').hide();
        $('#section-login').show();
    });

    $("#hrefRegister").click(function(){      
        $('#section-login').hide();
        $('#section-register').show();
    });

    $("#btnLogOut").click(function(){      
        $(".container").hide();
        $("#section-register").hide();
        $(".forms-container").show();
        $("#section-login").show();
    });

    $("#btnLogin").click(function(){      
        let inputUsername = document.getElementById('txtUsername').value;
        let inputPassword = document.getElementById('txtPassword').value;
        
        if(checkingForBlankFields(inputUsername) && checkingForBlankFields(inputPassword)){
            if (inputUsername === 'admin' && inputPassword === 'admin') {
                alert('WELCOME BACK ADMIN...');
        
                $('.forms-container').hide();
                $(".container").show();
                $('#containerResidents').show();
                enableButtons();
                clearLoginForms();
            }else if (isLoggedIn){
                alert("Login successful. Welcome, " + inputUsername);
                alert("NOTE: ONLY ADMIN CAN USE DELETE AND UPDATE FUNCTION...");

                $('.forms-container').hide();
                $(".container").show();
                $('#section1').show();  
                disableButtons();
                clearLoginForms();
            }else {
                alert("Invalid username or password.");
                clearLoginForms();
            }
        }
        
    });

    $("#btnRegister").click(function(){      
        let accounts = JSON.parse(localStorage.getItem('registeredAccounts'));
        let inputUsername = document.getElementById('txtRegUsername').value;
        let inputPassword = document.getElementById('txtRegPassword').value;
        let confirmPassword = document.getElementById('txtConfirmPassword').value;
        let isUsernameTaken = false;

        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].username === inputUsername) {
                isUsernameTaken = true;
                break;
            }
        }
        
        if(checkingForBlankFields(inputUsername) && checkingForBlankFields(inputPassword) && checkingForBlankFields(confirmPassword)){
           if(inputPassword !== confirmPassword){
                alert("Password Do Not Match...");
           }else{
                if(isUsernameTaken){
                    alert("Username Has Already Been Taken...")
                }else {
                    let newAccount = new Register(inputUsername,inputPassword);
                    accounts.push(newAccount);
                    localStorage.setItem('registeredAccounts', JSON.stringify(accounts));

                    alert("Successfully Registered " + inputUsername);
                    alert("NOTE: ONLY ADMIN CAN USE DELETE AND UPDATE FUNCTION...");
                    $('.forms-container').hide();
                    $(".container").show();
                    $('#section1').show();
                    clearRegisterForms();
                    disableButtons();
                }
           }
        }
    });


    function loadDefaults() { 
        let retrievedTableBlotter = localStorage.getItem('tblBlotter');
        let retrievedAccounts = localStorage.getItem('registeredAccounts');

        if (localStorage.length === 0) {
             localStorage.setItem("tblResidentId", 1);
            localStorage.setItem("tblResidents", null);
            localStorage.setItem('caseNumber', 1);
            localStorage.setItem('tblBlotter', JSON.stringify(arrBlotterRecords));
            localStorage.setItem('adminCredentials', JSON.stringify(adminAccount));
            localStorage.setItem('registeredAccounts', JSON.stringify(arrAccounts)); 
        } else {
            arrBlotterRecords = JSON.parse(retrievedTableBlotter);
            arrAccounts = JSON.parse(retrievedAccounts);
            displayTableBlotter();
            if (Number(localStorage.getItem('tblResidentId')) != 1) {
                // If tblResidentId is not equal to 1, display the table and retrieve resident data
                displayTable();
                residentList = JSON.parse(localStorage.getItem('tblResidents'));
              }
        }
    }

    function displayTableBlotter() { 
            let retrievedBlotterData = localStorage.getItem('tblBlotter');
            let tbodyBlotterReport = document.querySelector(".tableBody-blotter");
            let tbodyGenerateReport = document.querySelector(".tableBody-generateReport");
            tbodyBlotterReport.innerHTML = "";
            tbodyGenerateReport.innerHTML = " ";

            let data = JSON.parse(retrievedBlotterData);

                for(let i = 0; i < data.length; i++) {
                    let rowTableBlotter = document.createElement("tr");
                    let rowReportTable = document.createElement("tr");

                    let cell1TableBlotter = document.createElement("td");
                    let cell2TableBlotter = document.createElement("td");
                    let cell3TableBlotter = document.createElement("td");
                    let cell4TableBlotter = document.createElement("td");
                    let cell5TableBlotter = document.createElement("td");
                    let cell6TableBlotter = document.createElement("td");
                    let cell7TableBlotter = document.createElement("td");
                    let cell8TableBlotter = document.createElement("td");

                    let cell1ReportTable = document.createElement("td");
                    let cell2ReportTable = document.createElement("td");
                    let cell3ReportTable = document.createElement("td");
                    let cell4ReportTable = document.createElement("td");
                    let cell5ReportTable = document.createElement("td");    
                    let cell6ReportTable = document.createElement("td");
                    let cell7ReportTable = document.createElement("td");
                    let cell8ReportTable = document.createElement("td");

                    let delbtn = document.createElement("button");
                    let updatebtn = document.createElement("button");
                    let report = document.createElement("button");

                    cell1TableBlotter.textContent = data[i].caseNumber;
                    cell2TableBlotter.textContent = data[i].name;
                    cell3TableBlotter.textContent = data[i].sex;
                    cell4TableBlotter.textContent = data[i].address;
                    cell5TableBlotter.textContent = data[i].suspect;
                    cell6TableBlotter.textContent = data[i].date;
                    cell7TableBlotter.textContent = data[i].description;

                    cell1ReportTable.textContent = data[i].caseNumber;
                    cell2ReportTable.textContent = data[i].name;
                    cell3ReportTable.textContent = data[i].sex;
                    cell4ReportTable.textContent = data[i].address;
                    cell5ReportTable.textContent = data[i].suspect;
                    cell6ReportTable.textContent = data[i].date;
                    cell7ReportTable.textContent = data[i].description;

                    rowTableBlotter.appendChild(cell1TableBlotter);
                    rowTableBlotter.appendChild(cell2TableBlotter);
                    rowTableBlotter.appendChild(cell3TableBlotter);
                    rowTableBlotter.appendChild(cell4TableBlotter);
                    rowTableBlotter.appendChild(cell5TableBlotter);
                    rowTableBlotter.appendChild(cell6TableBlotter);
                    rowTableBlotter.appendChild(cell7TableBlotter);

                    rowReportTable.appendChild(cell1ReportTable);
                    rowReportTable.appendChild(cell2ReportTable);
                    rowReportTable.appendChild(cell3ReportTable);
                    rowReportTable.appendChild(cell4ReportTable);
                    rowReportTable.appendChild(cell5ReportTable);
                    rowReportTable.appendChild(cell6ReportTable);
                    rowReportTable.appendChild(cell7ReportTable);

                    cell4TableBlotter.id = "tableBlotterAdress";
                    cell7TableBlotter.id = "tableBlotterDescription";

                    cell4ReportTable.id = "reportTableAddress";
                    cell7ReportTable.id = "reportTableDescription";

                    delbtn.textContent = "Delete";
                    delbtn.id = "tblDeleteBtn";
                    updatebtn.textContent = "Update";
                    updatebtn.id = "tblUpdateBtn";
                    report.textContent = "Generate Report";
                    report.id = 'tblReportBtn';

                    cell8TableBlotter.appendChild(delbtn);
                    cell8TableBlotter.appendChild(updatebtn);
                    cell8ReportTable.appendChild(report);

                    rowTableBlotter.appendChild(cell8TableBlotter);
                    rowReportTable.appendChild(cell8ReportTable)

                    tbodyBlotterReport.appendChild(rowTableBlotter);
                    tbodyGenerateReport.appendChild(rowReportTable);

                    delbtn.onclick = function() {
                        data.splice(i, 1); // Remove the item from the data array
                        localStorage.setItem('tblBlotter', JSON.stringify(data)); // Update the localStorage
                        arrBlotterRecords = data; 
                        
                        displayTableBlotter(); // Re-render the table
                    };

                    updatebtn.onclick = function() {
                        let blotterForms = document.getElementById('section1');
                        let blotterRecord = document.getElementById('section2');
                        let btnSave = document.createElement("button");
                        let divElement = document.querySelector(".fifth-part");

                        let name = cell2TableBlotter.textContent;
                        let suspectName = cell5ReportTable.textContent;
                        let [compLastName, compFirstName, compMiddleInitial] = name.split(", ");
                        let [susLastName, susFirstName , susMiddleName ] = suspectName.split(", ");

                        // Set the values of the text fields
                        lastName.value = compLastName;
                        firstName.value = compFirstName;
                        middleInitial.value = compMiddleInitial;
                        address.value = cell4TableBlotter.textContent;
                        sex.value = cell3TableBlotter.textContent;
                        suspectLastName.value = susLastName;
                        suspectFirstName.value = susFirstName;
                        suspectMiddleName.value = susMiddleName;
                        date.value = cell6TableBlotter.textContent;
                        description.value = cell7TableBlotter.textContent;

                        btnSave.textContent = "Save";
                        btnSave.id = "btnSave";
                        divElement.appendChild(btnSave);

                        blotterRecord.style.display = 'none';
                        blotterForms.style.display = 'block';

                        btnSave.onclick = function () {
                            let updatedSex = sex.value.charAt(0).toUpperCase();
                            let updatedAddress = address.value;
                            let updatedDate = date.value;
                            let updatedDescription = description.value;

                            let compUpdatedLastName = lastName.value;
                            let compUpdatedFirstName = firstName.value;
                            let compUpdatedMiddle = middleInitial.value;

                            let susUpdatedLastName = suspectLastName.value;
                            let susUpdatedFirstName = suspectFirstName.value;
                            let susUpdatedMiddleName = suspectMiddleName.value;
                                
                            let compUpdatedFullName = `${capitalizeName(compUpdatedLastName)}, ${capitalizeName(compUpdatedFirstName)}, ${capitalizeName(compUpdatedMiddle)}`;
                            let susUpdatedFullName = `${capitalizeName(susUpdatedLastName)}, ${capitalizeName(susUpdatedFirstName)}, ${capitalizeName(susUpdatedMiddleName)}`;

                            cell2TableBlotter.textContent = compUpdatedFullName;
                            cell3TableBlotter.textContent = updatedSex;
                            cell4TableBlotter.textContent = updatedAddress;
                            cell5TableBlotter.textContent = susUpdatedFullName;
                            cell6TableBlotter.textContent = updatedDate;
                            cell7TableBlotter.textContent = updatedDescription;

                            cell2ReportTable.textContent = compUpdatedFullName;
                            cell3ReportTable.textContent = updatedSex;
                            cell4ReportTable.textContent = updatedAddress;
                            cell5ReportTable.textContent = susUpdatedFullName;
                            cell6ReportTable.textContent = updatedDate;
                            cell7ReportTable.textContent = updatedDescription;

                            // Update the corresponding fields in the data array
                            data[i].name = compUpdatedFullName;
                            data[i].sex = updatedSex;
                            data[i].address = updatedAddress;
                            data[i].suspect = susUpdatedFullName;
                            data[i].date = updatedDate;
                            data[i].description = updatedDescription;

                            localStorage.setItem('tblBlotter', JSON.stringify(data)); // Update the localStorage with the current data
                            btnSave.style.display = "none";
                            blotterRecord.style.display = 'block';
                            blotterForms.style.display = 'none';
                            clearFields();
                            }; 
                            
                        };

                        report.onclick = function() {
                            let txtComplainantName = document.getElementById("complainantName");
                            let txtComplainantAddress = document.getElementById("complainantAddress");
                            let txtComplainantSex = document.getElementById("complainantSex");
                            let txtSuspectName = document.getElementById("suspectName");
                            let txtIncidentDate = document.getElementById("incidentDate");
                            let reportBody = document.getElementById("incidentDescription");

                            txtComplainantName.textContent = cell2ReportTable.textContent;
                            txtComplainantAddress.textContent = cell4ReportTable.textContent;
                            txtComplainantSex.textContent = cell3ReportTable.textContent;
                            txtSuspectName.textContent = cell5ReportTable.textContent;
                            txtIncidentDate.textContent = cell6ReportTable.textContent;
                            reportBody.textContent = cell7ReportTable.textContent;

                            $('#section3').hide();
                            $('#section-generateReport').show();
                        };

                    }
                }

    function disableButtons() {
        let updateButtons = document.querySelectorAll("#tblUpdateBtn");
        let deleteButtons = document.querySelectorAll("#tblDeleteBtn");
                  
        updateButtons.forEach(function(button) {
            button.disabled = true;
        });
                  
        deleteButtons.forEach(function(button) {
             button.disabled = true;
        });
    }
                  

    function enableButtons() {
        let updateButtons = document.querySelectorAll("#tblUpdateBtn");
        let deleteButtons = document.querySelectorAll("#tblDeleteBtn");
      
        updateButtons.forEach(function(button) {
          button.disabled = false;
        });
      
        deleteButtons.forEach(function(button) {
          button.disabled = false;
        });
      }

    function capitalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    function clearFields() {
        firstName.value = "";
        lastName.value = "";
        middleInitial.value = "";
        address.value = "";
        sex.value = "";
        suspectLastName.value = "";
        suspectFirstName.value = "";
        suspectMiddleName.value = "";
        date.value = "";
        description.value = "";
    }

    function generalChecking(input) {
        let numbers = '0123456789';

        if (input.length === 0) {
            alert("Fill Up Fields..."); // Input is empty or contains only spaces
        } else {
            for (let i = 0; i < input.length; i++) {
                if (numbers.includes(input[i])) {
                    alert("Numbers Are Not Allowed.."); // Input contains numbers
                    return false;
                }
            }
                return true;
            }
        }

    function checkingForBlankFields(input) {
        if (input.length == 0) {
        alert("Fill Up The Fields...");
        return false; // Add return statement here to prevent form submission
        } else {
        return true;
        }
    }

    function clearRegisterForms() {
        let inputUsername = document.getElementById('txtRegUsername');
        let inputPassword = document.getElementById('txtRegPassword');
        let confirmPassword = document.getElementById('txtConfirmPassword');

        inputUsername.value = "";
        inputPassword.value = "";
        confirmPassword.value = "";
    }

    function clearLoginForms() {
        let inputUsername = document.getElementById('txtUsername');
        let inputPassword = document.getElementById('txtPassword');

        inputUsername.value = "";
        inputPassword.value = "";
    }



    //-------------------------------------------------------------- Code for the Accounts tab -----------------------------------------
    // whenever the user click the button "Create Record"
    $("#btnInsert").click(function(){
        // it will hide the table and show the Registration form
        $("#containerResidents").hide();
        $('#RegistrationForm').show();
    });

    //whenever the user uploads an image this code will execute
    $('#image-input').change(function() {
          // Get the image input element
          let imageInput = document.getElementById('image-input');

          // Get the image preview element
          let preview = document.getElementById('image-preview');

          // Get the selected file
          let file = imageInput.files[0];

          // Create a FileReader object to read the file
          let reader = new FileReader();

          // Callback function executed when FileReader finishes loading the file
          reader.onloadend = function() {
            // Set the background image of the preview element with the loaded file data
            preview.style.backgroundImage = `url(${reader.result})`;
          }

          // Read the file as a Data URL if a file is selected
          if (file) {
            reader.readAsDataURL(file);
          } else {
            // If no file is selected, clear the background image of the preview element
            preview.style.backgroundImage = '';
          }
        });

    // whenever the user changes the birth date in the Registration Form this will execute
    $('#birthdate').change(function() {
          // Get the birthdate input value and create a new Date object
          var birthdate = new Date(document.getElementById("birthdate").value);

          // Get the current date
          var today = new Date();

          // Calculate the age based on the birthdate and current date
          var age = today.getFullYear() - birthdate.getFullYear();

          // Calculate the difference in months between birthdate month and current month
          var monthDiff = today.getMonth() - birthdate.getMonth();

          // Check if the birthdate month is greater than the current month, or if the months are the same but the birthdate day is greater than the current day
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
            // Reduce the calculated age by 1 if the birthdate hasn't occurred yet this year
            age--;
          }

          // Check if the calculated age is less than 0 (invalid birthdate)
          if (age < 0) {
            // Display an alert for an invalid birthdate
            alert("Invalid birthdate");
            // Clear the birthdate input value
            $('#birthdate').val('');
          } else {
            // Set the calculated age in the HTML element with the ID "age"
            document.getElementById("age").innerHTML = age;
          }
        });

    
    $('#btnAddResident').click(function() {
          // Get the current resident ID from local storage and convert it to a number
          let resId = Number(localStorage.getItem("tblResidentId"));

          // Get the input fields for resident information
          let txtLname = document.getElementById('lastName');
          let txtFname = document.getElementById('firstName');
          let txtMname = document.getElementById('middleName');
          let bday = document.getElementById('birthdate');
          let age = document.getElementById('age').innerHTML;
          let gender = getGender();
          let status = getStatus();
          let address = document.getElementById('address');
          let religion = document.getElementById('religion');
          let contactNum = document.getElementById('number');

          // Get the image input field and the selected file
          let imageInput = document.getElementById('image-input');
          let file = imageInput.files[0];
          let reader = new FileReader();

          // Callback function executed when FileReader finishes loading the file
          reader.onloadend = function() {
            // Get the loaded image data in base64 format
            let photo = reader.result;

            // Create a new Resident object with the input values
            let objResident = new Resident(resId, txtLname.value, txtFname.value, txtMname.value, bday.value, age, gender, status, address.value, religion.value, contactNum.value, photo);

            // Push the new resident object to the residentList array
            residentList.push(objResident);

            // Convert the residentList array to a serialized JSON string
            let serializedObj = JSON.stringify(residentList);

            // Store the serialized residentList in local storage
            localStorage.setItem("tblResidents", serializedObj);

            // Display the updated table
            displayTable();

            // Increment the resident ID by 1 and update the value for the tblResidentId in the localStorage
            resId++;
            localStorage.setItem("tblResidentId", resId);

            // Clear the input fields
            clearFieldsResidents();
          }

          // Read the file as a Data URL
          reader.readAsDataURL(file);
        });





    function getGender(){
     // Get the radio buttons by their name
      let radioButtons = document.getElementsByName('gender');
      let gender = "";

      // Loop through the radio buttons to find the selected value
      for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
          // Get the selected value
          gender = radioButtons[i].value;

          // Break out of the loop since we found the selected value
          break;
        }
      }
       // if the gender is still empty string
      // provide an alternative value
       if(gender == ""){
        return 'no record provided';
      }else{
        return gender;
      } 
    }

    function getStatus(){
        // Get the radio buttons by their name
      var radioButtons = document.getElementsByName('status');
      let status = "";

      // Loop through the radio buttons to find the selected value
      for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
          // Get the selected value
          status = radioButtons[i].value;

          break;
        }
      }
      // if the status is still empty string
      // provide an alternative value
       if(status == ""){
            return 'no record provided';
          }else{
            return status;
          } 
    }

    // this function will clear all the fields in the form
    function clearFieldsResidents(){
        $('#image-preview').css('background-image', 'none');
        $('#lastname').val('');
        $('#firstname').val('');
        $('#middlename').val('');
        $('#birthdate').val('');
        $('input[name="gender"]').prop('checked', false);
        $('input[name="status"]').prop('checked', false);
        $('#age').val('');
        $('#address').val('');
        $('#religion').val('');
        $('#number').val('');
    }

    // this function will display all the residents in the table
    function displayTable(){

        // create a variable that will store the objects coming from the localStorage
        let objResidents = JSON.parse(localStorage.getItem('tblResidents'));

        let tableBody = document.getElementById('tblResident');

        for(let index = 0; index < objResidents.length; index++){
            let instance = new Resident();
            //Assign and apply all the properties and methods defined in the instance
            //object(Resident class) to the deserailizedObj so that it will receive the
            //methods of the Resident class and be usable
            Object.assign(instance, objResidents[index]);
            objResidents[index] = instance;

            // Create a new row
          var newRow = document.createElement('tr');

          // Add data to the row
          var cell1 = document.createElement('td');
          cell1.textContent = instance.residentId;
          newRow.appendChild(cell1);

          var cell2 = document.createElement('td');
          cell2.textContent = instance.lastName;
          newRow.appendChild(cell2);

          var cell3 = document.createElement('td');
          cell3.textContent = instance.firstName;
          newRow.appendChild(cell3);

          var cell4 = document.createElement('td');
          cell4.textContent = instance.middleName;
          newRow.appendChild(cell4);

          var cell5 = document.createElement('td');
          cell5.textContent = instance.birthDate;
          newRow.appendChild(cell5);

          var cell6 = document.createElement('td');
          cell6.textContent = instance.age;
          newRow.appendChild(cell6);

          var cell7 = document.createElement('td');
          cell7.textContent = instance.gender;
          newRow.appendChild(cell7);

          var cell8 = document.createElement('td');
          cell8.textContent = instance.civilStatus;
          newRow.appendChild(cell8);

          var cell9 = document.createElement('td');
          cell9.textContent = instance.address;
          newRow.appendChild(cell9);

          var cell10 = document.createElement('td');
          cell10.textContent = instance.religion;
          newRow.appendChild(cell10);

          var cell11 = document.createElement('td');
          cell11.textContent = instance.contactNumber;
          newRow.appendChild(cell11);

          var cell12 = document.createElement('td');
      
            // Create button 1
            var button1 = document.createElement('button');
            button1.textContent = 'Update';
            button1.style.marginRight = '5px'
            cell12.appendChild(button1);

            // Create button 2
            var button2 = document.createElement('button');
            button2.textContent = 'Delete';
            button2.style.marginRight = '5px'
            cell12.appendChild(button2);

            // Create button 3
            var button3 = document.createElement('button');
            button3.textContent = 'View Full Details';
            button3.style.marginRight = '5px'
            cell12.appendChild(button3);
            newRow.appendChild(cell12);

          // Append the new row to the table body
          tableBody.appendChild(newRow);

        // whenever the user clicks the button with the text Update these lines of codes will execute
        button1.addEventListener('click', () => {

            // remove the readonly property of the fields so that the user can edit the fields
            $('#FullDetailsForm #lastName').val(instance.lastName).removeAttr('readonly');
            $('#FullDetailsForm #firstName').val(instance.firstName).removeAttr('readonly');
            $('#FullDetailsForm #middleName').val(instance.middleName).removeAttr('readonly');
            $('#FullDetailsForm #birthdate').val(instance.birthDate).removeAttr('readonly');
            $('#FullDetailsForm #age').text(instance.age);
            $('#FullDetailsForm input[name="gender"]').removeAttr('disabled');
            $('#FullDetailsForm input[name="status"]').removeAttr('disabled');
            $('#FullDetailsForm #address').val(instance.address).removeAttr('readonly');
            $('#FullDetailsForm #religion').val(instance.religion).removeAttr('readonly');
            $('#FullDetailsForm #number').val(instance.contactNumber).removeAttr('readonly');
            $('#FullDetailsForm #image-preview').css('background-image', 'url(' + instance.photo + ')');
            $('#FullDetailsForm #image-input').removeAttr('disabled');
            $('#FullDetailsForm #btnUpdate').removeAttr('disabled');

            // show the FullDetailsForm
           $('#FullDetailsForm').show();
           $('#containerResidents').hide();

           // whenever the user changes the birth date  it will automatically change the age
           $('#FullDetailsForm #birthdate').change(function() {
              var birthdateValue = $('#FullDetailsForm #birthdate').val();

              var birthdate = new Date(birthdateValue);
              var today = new Date();
              var aged = today.getFullYear() - birthdate.getFullYear();
              var monthDiff = today.getMonth() - birthdate.getMonth();

              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                aged--;
              }

              if (aged < 0) {
                alert("Invalid birthdate");
                $('#FullDetailsForm #birthdate').val('');
              } else {
                $('#FullDetailsForm #age').text(aged);
              }
            });

            // if the gender is still empty string
      // provide an alternative value
           function getGender(){
                 // Get the radio buttons by their name
                  let radioButtons = $('#FullDetailsForm input[name="gender"]');
                  let gender = "";

                  // Loop through the radio buttons to find the selected value
                  for (var i = 0; i < radioButtons.length; i++) {
                    if (radioButtons[i].checked) {
                      // Get the selected value
                      gender = radioButtons[i].value;

                      // Break out of the loop since we found the selected value
                      break;
                    }
                  }
                  if(gender == ""){
                    return 'no record provided';
                  }else{
                    return gender;
                  }           
                }

                 // if the status is still empty string
                // provide an alternative value
                function getStatus(){
                    // Get the radio buttons by their name
                  var radioButtons = $('#FullDetailsForm input[name="status"]');
                  let status = "";

                  // Loop through the radio buttons to find the selected value
                  for (var i = 0; i < radioButtons.length; i++) {
                    if (radioButtons[i].checked) {
                      // Get the selected value
                      status = radioButtons[i].value;

                      break;
                    }
                  }
                  if(status == ''){
                    return "no record provided";
                  }else{    
                  return status;
                  }
                }

                // whenever the user uploads a image it will immediately show the image uploaded in base64 format
                $('#FullDetailsForm #image-input').change(function(){
                    let imageInput = $('#FullDetailsForm #image-input');

                    let file = imageInput[0].files[0];
                    let reader = new FileReader();
                    
                    reader.onloadend = function() {
                    $('#FullDetailsForm #image-preview').css('background-image', 'url(' + reader.result + ')');
                  }
                    reader.readAsDataURL(file);
                  
            });

                // whenver the user clicks the update button in the Full Details Form, these lines of code will execute
           $('#FullDetailsForm #btnUpdate').click(function(){

                // set the value of the fields to the corresponding property of the instance created
                instance.lastName = $('#FullDetailsForm #lastName').val();
                instance.firstName = $('#FullDetailsForm #firstName').val();
                instance.middleName = $('#FullDetailsForm #middleName').val();
                instance.birthDate = $('#FullDetailsForm #birthdate').val();
                instance.age = $('#FullDetailsForm #age').html();
                instance.gender = getGender();
                instance.civilStatus = getStatus();
                instance.address = $('#FullDetailsForm #address').val();
                instance.religion = $('#FullDetailsForm #religion').val();
                instance.contactNumber = $('#FullDetailsForm #number').val();
                
                // this will get the file uploaded
                let imageInput = $('#FullDetailsForm #image-input');
                let file = imageInput[0].files[0];
                let reader = new FileReader();

                // upon reading the file using the reader these line of codes will execute
                // note that this will only execute whenever the user changes the picture
                // so if we dont add seperate code for saving the objResidents to the localStorage it wont update the properties
                reader.onloadend = function() {
                    // store the base64 format of the uploaded image to the variable photo
                    let photo = reader.result;

                    // set the current instance property "photo" to base64 format of the uploaded image
                    instance.photo = photo;

                    // update the current object
                    objResidents[index] = instance;

                    // save the objResidents to the localStorage
                    let serializedObj = JSON.stringify(objResidents);
                    localStorage.setItem("tblResidents", serializedObj);
                    displayTable();
                    $('#containerResidents').show();

                }
                    // update the current object
                    objResidents[index] = instance;

                    // save the objResidents to the localStorage
                    let serializedObj = JSON.stringify(objResidents);
                    localStorage.setItem("tblResidents", serializedObj);
                    displayTable();

                    reader.readAsDataURL(file);
                    $('#containerResidents').show();


           });
        });

        // whenever the user click the button with the text delete, this will execute
        button2.addEventListener('click', function() {
            // Remove the current index from the array
            objResidents.splice(index, 1);

             // Save the updated array back to localStorage
            let serializedObj = JSON.stringify(objResidents);
            localStorage.setItem("tblResidents", serializedObj);
            displayTable();
            location.reload();
           

          });

        // whenever the user clicks the button with the text view Full Details, this will execute
        button3.addEventListener('click', function(){

            // set all the values of the fields to the corresponding properties of the current instance
            $('#FullDetailsForm #lastName').val(instance.lastName);
            $('#FullDetailsForm #firstName').val(instance.firstName);
            $('#FullDetailsForm #middleName').val(instance.middleName);
            $('#FullDetailsForm #birthdate').val(instance.birthDate);
            $('#FullDetailsForm #age').text(instance.age);
            $('#FullDetailsForm input[name="gender"][value="' + instance.gender + '"]').prop('checked', true);
            $('#FullDetailsForm input[name="status"][value="' + instance.civilStatus + '"]').prop('checked', true);
            $('#FullDetailsForm #address').val(instance.address);
            $('#FullDetailsForm #religion').val(instance.religion);
            $('#FullDetailsForm #number').val(instance.contactNumber);
            $('#FullDetailsForm #image-preview').css('background-image', 'url(' + instance.photo + ')');

            // show the Full Details Form
           $('#FullDetailsForm').show();
           $('#containerResidents').hide();
        });
          
        }
        residentList = objResidents;
    }

        // whenever the user clicks the button "Back" in the Registration form it will show the table of Residents and hide the registration form
    $("#btnBack").click(function(){
        $("#containerResidents").show();
        $('#RegistrationForm').hide();
        clearFieldsResidents();
    });

});