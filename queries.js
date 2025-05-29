//creating a 
db.use plp_bookstore
//creating a creation called books
db.createCollection("books")
//books that arein stock and were published after 2010
db.books.find({in_genre: true,published_year:{$gt: 2010}})
//projection that returns title,author and price
db.books.find({},{title:true,author:true,price:true,_id:false})
//implement sorting by to display books by price
//acsending
db.books.find().sort({price:1})
//descending
db.books.find().sort({price:-1})
//using limit and skip method to implement pagitation
db.books.find().skip(5).limit(5)
//aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
    {$group:{_id:"genre",average:{$avg:"$price"}}}
])
//finding the author with the most books in the collection
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
 
])
//a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: [{ $subtract: ["$published_year", { $mod: ["$published_year", 10] }] }, 0, 4] },
          "s"
        ]
      }
    }
  },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);
//indexing
//creating an index called title
db.books.createIndex({title:1})
//compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: -1 });
//Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({ title: "The Silent Patient" }).explain("executionStats");
db.books.find({ title: "The Alchemist",year_published:1988 }).explain("executionStats")