###knockoutjs 入门 Demo    
* [源码](http://github.com/wangmoumei/gulp-test) 跟gulp放在一起了    
html:    
```
<h2>todo list</h2>
<div class="radio-box">
    <label for="all"><input type="radio" id="all" value="all" name="status" checked="checked" data-bind="event:{change:changeStatus}" />所有(<span data-bind="text:allCount"></span>)</label>
    <label for="do"><input type="radio" id="do" value="do" name="status" data-bind="event:{change:changeStatus}" />尚未开始(<span data-bind="text:doCount"></span>)</label>
    <label for="doing"><input type="radio" id="doing" value="doing" name="status" data-bind="event:{change:changeStatus}" />正在进行(<span data-bind="text:doingCount"></span>)</label>
    <label for="done"><input type="radio" id="done" value="done" name="status" data-bind="event:{change:changeStatus}" />已完成(<span data-bind="text:doneCount"></span>)</label>
    | <label class="deleted" for="deleted"><input type="radio" id="deleted" value="deleted" name="status" data-bind="event:{change:changeStatus}" />已删除(<span data-bind="text:deletedCount"></span>)</label>
</div>
<ul class="todo-list" data-bind='foreach: todoList'>
    <li data-bind = "css:{do:status==2,doing:status==1,done:!status}">
        <h3 data-bind = "text: name"></h3>
        <p data-bind = "text: description,attr:{title:description}"></p>
        <a class="btn" data-bind="visible:!isDelete && status==2,click:vm.start">开始</a>
        <a class="btn" data-bind="visible:!isDelete && (status==1 || status==2),click:vm.finish">完成</a>
        <a class="btn" data-bind="visible:!isDelete && status==0,click:vm.restart">重新开始</a>
        <a class="btn" data-bind="visible:!isDelete,click:vm.deleteItem">删除</a>
        <a class="btn" data-bind="visible:isDelete,click:vm.restore">还原</a>
    </li>
</ul>
<div class="empty" data-bind="visible:todoList().length<1">一个任务也没有，空空如也</div>
<hr>
<form action="javascript:;" data-bind="submit:addToList">
    <h2>new todo</h2>
    <p>name:*</p>
    <input type="text" name="name" id="name" data-bind="value:formData.name">
    <p>description:</p>
    <textarea name="description" id="description" cols="30" rows="10" data-bind="value:formData.description"></textarea>
    <br>
    <input type="submit" value="提交">
</form>
```    
js:    
```
var todoList = [
    {
        name:"aaaa",
        description:"aaaaaaaaaaaaaaaaaaaaaaaa",
        status:0,
        sort:1,
        isDelete:true
    },{
        name:"bbbb",
        description:"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        status:0,
        sort:2,
        isDelete:false
    },{
        name:"cccc",
        description:"cccccccccccccccccc",
        status:1,
        sort:3,
        isDelete:false
    },{
        name:"dddd",
        description:"dddddddddddd",
        status:2,
        sort:4,
        isDelete:false
    }
];

var vm = {
    changeStatus:function(data,event){
        var statusValue = event.target.value;
        data.status = statusValue;
        data.listFilter();
        // console.log(data);
    },
    listFilter:function(){
        var that = this;
        that.todoList.removeAll();
        if(todoList.length > 0)
            switch(that.status){
                case "all":
                    $.map(todoList,function(item){
                        if(!item.isDelete)
                            that.todoList.push(item);
                    })
                    break;
                case "do":
                    $.map(todoList,function(item){
                        if(!item.isDelete && item.status == 2)
                            that.todoList.push(item);
                    })
                    break;
                case "doing":
                    $.map(todoList,function(item){
                        if(!item.isDelete && item.status == 1)
                            that.todoList.push(item);
                    })
                    break;
                case "done":
                    $.map(todoList,function(item){
                        if(!item.isDelete && !item.status)
                            that.todoList.push(item);
                    })
                    break;
                case "deleted":
                    $.map(todoList,function(item){
                        if(item.isDelete)
                            that.todoList.push(item);
                    })
                    break;
        }
        that.todoList.sort(function(left,right){
            if(left.status == right.status){
                return left.sort>right.sort
            }else if(left.status == 1 || right.status == 1){
                return right.status==1;
            }else
                return left.status<right.status
        })
    },
    status:"all",
    todoList : ko.observableArray([]),
    computeCount : function(){
        var counts = [0,0,0];
        $.map(todoList,function(item){
            if(!item.isDelete)
                counts[item.status] ++ ;
        });
        // console.log(counts);
        this.allCount(counts[0]+counts[1]+counts[2]);
        // this.allCount(todoList.length);
        this.doCount(counts[2]);
        this.doingCount(counts[1]);
        this.doneCount(counts[0]);
        this.deletedCount(todoList.length - this.allCount());
        this.listFilter();
    },
    allCount:ko.observable(0),
    doCount:ko.observable(0),
    doingCount:ko.observable(0),
    doneCount:ko.observable(0),
    deletedCount:ko.observable(0),
    addToList: function(event){
        console.log(this.formData)
        if(this.formData.name().length<1)
            // this.formData.focus;
            return;
        else{
            todoList.push({
                name:this.formData.name(),
                description:this.formData.description(),
                status:2,
                sort:todoList.length,
                isDelete:false
            })
        }
        this.computeCount();
    },
    formData:{
        name:ko.observable(""),
        description:ko.observable("")
    },
    deleteItem:function(data,event){
        data.isDelete = true;
        vm.computeCount();
    },
    restore:function(data,event){
        data.isDelete = false;
        vm.computeCount();
    },
    start:function(data,event){
        data.status = 1;
        vm.computeCount();
    },
    finish:function(data,event){
        data.status = 0;
        vm.computeCount();
    },
    restart:function(data,event){
        data.status = 1;
        vm.computeCount();
    }
}

ko.applyBindings(vm);
vm.computeCount(); 
```    
css:    
```
*{
        padding:0;margin:0;font-family: 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    body{
        padding:50px;
    }
    label{
        cursor: pointer
    }
    ul.todo-list li{
        list-style: none;
        border-left-width: 5px;
        border-left-style: solid;
        padding-left: 10px;
        margin: 3px;
    }
    ul.todo-list li.do{
        border-left-color: #337ab7
    }
    ul.todo-list li.doing{
        border-left-color: #5cb85c
    }
    ul.todo-list li.done{
        border-left-color: #f0ad4e
    }
    ul.todo-list li p{
        overflow: hidden; 
        white-space: nowrap; 
        -webkit-text-overflow:ellipsis; 
        -khtml-text-overflow: ellipsis;  
        -icab-text-overflow: ellipsis;  
        -moz-text-overflow: ellipsis;  
        -o-text-overflow: ellipsis;  
        text-overflow: ellipsis; 
        width: 300px;
        color: #888;
    }
    .radio-box{
        padding: 10px;
    }
    .radio-box label{
        padding: 10px;
    }
    .btn{
        font-size: 12px;
        color: #337ab7;
        cursor: pointer;
    }
    .deleted{
        color: #999;
    }
    .empty{
        padding: 10px;
        color: #666;
        border-left: 5px solid #aaa;
        margin: 3px;
    }
```
