class ApiFeatures {
  constructor(query,querystr){
    this.query = query;
    this.querystr = querystr;
  }
  search() {
    const keyword = this.querystr.keyword ? {
      name:{
        $regex:this.querystr.keyword,
        $options:"i",
      },
    }
    :{};
    console.log(keyword);
    this.query = this.query.find({...keyword});
    return this;
  }
  filter() {
    const queryCopy = {...this.querystr};
    // removing some fields
    const removeFields = ["keyword","page","limit"];
    removeFields.forEach(key=>delete queryCopy[key]);
    this.query = this.query.find(queryCopy);
    return this;
  }
};
module.exports = ApiFeatures;
