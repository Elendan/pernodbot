import * as Request from "tedious";

let config = {
    userName: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    server: process.env.DATABASE_SERVER,
    options: {
        database: process.env.DATABASE_NAME,
        encrypt: true
    }
}

let connection = new Request.Connection(config);

connection.on('connect', function(err) {
    if (err) {
        console.log(err);
    }
    else {
        queryDatabase();
    }
});

function queryDatabase()
   { console.log('Reading rows from the Table...');

       // Read all rows from table
     let request = new Request.Request(
          "SELECT * FROM Sessions",
             function(err, rowCount, rows) 
                {
                    console.log(rowCount + ' row(s) returned');
                    process.exit();
                }
            );

     request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
         });
             });
     connection.execSql(request);
   }