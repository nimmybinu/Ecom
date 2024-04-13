class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i", //case insensitive
                  },
              }
            : {};
        this.query = this.query.find({ ...keyword });
        return this; //entire class
    }
    filter() {
        const queryStrCopy = { ...this.queryStr };
        // console.log(queryStrCopy);
        //removing some fields for category
        const removeFields = ["keyword", "limit", "page"];
        removeFields.forEach((key) => delete queryStrCopy[key]);
        // this.query = this.query.find(queryStrCopy);

        //filter for price and rating
        // console.log(queryStrCopy);{ price: { lt: '1400', gt: '1200' } }
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(queryStr);{"price":{"$lt":"1400","$gt":"1200"}}
        return this;
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
module.exports = ApiFeatures;
