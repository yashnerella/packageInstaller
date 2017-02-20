/*
* Author: Yashwanth Nerella
* Date: 02/19/2017
* Title: Package Installer
* Description: This app determines the order in which the dependencies should be installed so as to have a successful installation.
* */


// declaring an array to store dependencies.
var dependencyArray = [];
// boolean value to decide whether or not to show the install order on the html page.
var displayInstallOrder = true;

// createDependencyArray() : This function is performed when "Add Dependency" button is clicked
/*
* This function performs validations & creates the dependency array.
* It restricts users to enter dependency strings only in the following format -> String: String (OR) String:
* Each VALID  dependency string submitted will be pushed to the dependency array.
* */
function createDependencyArray(){
    var dependencyString = document.getElementById("dependencyString").value;
    if(dependencyString.match(/([A-Za-z])+:\s([A-Za-z])*/g))
        dependencyArray.push(dependencyString.trim());
    else
        alert("Please enter the dependency string in the format=> String: String (or) String: . Do not forget to have a space after the colon.");
    document.getElementById("dependencyString").value = "";
}

// createInstallOrder(): This function is performed when "Create Installation Order" button is clicked
/*
* This function helps us create the install order. If there is a circular dependency then it recognizes
* and responds to the user by saying "Invalid installation".
* */
function createInstallOrder(){

    var dependencyMap = new Map();
    var tempStorage = [];
    var sortedDependencyTreeSet = [];
    var orderedPackageList = [];

    var dependency;

    //Used this prototype function from StackOverflow.
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    for(i=0; i<dependencyArray.length; i++){
        tempStorage = dependencyArray[i].split(": ");
        dependencyMap.set(tempStorage[0], tempStorage[1]);
    }

    dependencyMap.forEach(function(value, key){
        dependency = value;
        if(dependencyMap.get(key) != null){
            sortedDependencyTreeSet.push(key);
            sortedDependencyTreeSet.push(dependency);
        }

        while(true){
            if(dependencyMap.has(dependency)){
                if(dependencyMap.get(dependency) == '')
                    break;
                else
                    dependency = dependencyMap.get(dependency);
                if(sortedDependencyTreeSet.indexOf(dependency) < 0){
                    sortedDependencyTreeSet.push(dependency);
                }
                else{
                    displayInstallOrder = false;
                    break;
                }
            }
            else
                break;
        }

        sortedDependencyTreeSet.reverse();
        sortedDependencyTreeSet = sortedDependencyTreeSet.diff(orderedPackageList);
        orderedPackageList = orderedPackageList.concat(sortedDependencyTreeSet);

        for(i=0;i<sortedDependencyTreeSet.length;i++){
            dependencyMap.delete(sortedDependencyTreeSet[i])

        }
        sortedDependencyTreeSet.length = 0;
    });

    if(displayInstallOrder){
        document.getElementById("installOrder").innerHTML = "Install order: "+orderedPackageList.toString().toLocaleUpperCase();
    }
    else{
        document.getElementById("installOrder").innerHTML = "Invalid: Circular Dependencies found. Please check your dependencies";
    }
    document.getElementById("closingMessage").innerHTML = "RUN COMPLETE! Please REFRESH your page now for the next run!" +
        " Performing the operation without refreshing the page may not give expected results.";
}