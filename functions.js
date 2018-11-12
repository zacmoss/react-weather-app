
module.exports = {
    meanFunc: function (array) {
        const arrLength = array.length;
        const sum = array.reduce((a, b) => a + b, 0);
        const average = sum / arrLength;
        return average;
    },

    medianFunc: function (array) {
        let median = 0;
        const arrLength = array.length;
        array = array.sort(function(a, b){return a-b});
        if (
            arrLength % 2 === 0
        ) {
            median = (array[arrLength / 2 - 1] + array[arrLength / 2]) / 2;
        } else {
            median = array[(arrLength - 1) / 2];
        }
        return median;
    },

    modeFunc: function (array) { 
        let max = 0;
        let mode = [];
        let str = array.sort();
        str = "~" + str.join('~~') + "~"
        str.replace( /(~-*\d+~)\1*/g, function(a, b
        ) {
            var m = a.length / b.length;
            if (max <= m ) {
                if (max < m) {mode = [];max = m;}
                mode.push( b.replace(/~/g,""));
            } 
        });
        return mode;
    }
}