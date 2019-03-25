
import moment from "moment";

export default {
    data() {
        return {
            module   : 'users',
            data     : [],
            total    : 0,
            page     : 1,
            rows     : 5,
            modalForm: false,
            ids      : []
        };
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    console.log(this.formValidate._id);
                    //修改
                    if (this.formValidate._id) {
                        this.axios({
                            url: `http://localhost:3000/${this.module}/data/${
                this.formValidate._id
              }`,
                            method: 'put',
                            data  : this.formValidate
                        }).then(res => {
                            this.modalForm = false;
                            this.getData();
                            //数据重置
                            this.$data.formValidate = this.$options.data().formValidate;
                        });
                        //增加
                    } else {
                        this.axios({
                            url   : `http://localhost:3000/${this.module}/data`,
                            method: 'post',
                            data  : this.formValidate
                        }).then(res => {
                            this.modalForm = false;
                            this.getData();
                            this.$refs['formValidate'].resetFields();
                        });
                    }
                } else {
                    this.$Message.error('Fail!');
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        edit(id) {
            // 请示数据，打开对话框，显示表单的数据，进行提交
            this.axios({
                url   : `http://localhost:3000/${this.module}/data/${id}`,
                method: 'get'
            }).then(res => {
                this.formValidate = res.data;
                this.modalForm    = true;
            });
        },
        remove(id) {
            this.$Modal.confirm({
                title  : '确认操作',
                content: '<p>你确认删除该记录吗?</p>',
                onOk   : () => {
                    this.axios({
                        url   : `http://localhost:3000/${this.module}/data/${id}`,
                        method: 'delete'
                    }).then(res => {
                        this.getData();
                    });
                },
                onCancel: () => {
                    this.$Message.info('Clicked cancel');
                }
            });
        },
        getData() {
            this.axios({
                url   : `http://localhost:3000/${this.module}/list`,
                method: 'post',
                data  : {
                    page: this.page,
                    rows: this.rows
                }
            }).then(res => {
                this.total = res.data.total;
                this.data  = res.data.rows;
                console.log(this.rows);
                // console.log(res.data);
            });
        },
        onChangePage(page) {
            this.page = page;
            this.getData();
        },
        onPageSizeChange(rows) {
            this.rows = rows;
            console.log(this.rows);
            this.getData();
        },
        onSelect(selections) {
            var ids = [];
            for (let i = 0; i < selections.length; i++) {
                ids.push(selections[i]._id);
            }
            this.ids = ids.toString();
            console.log(ids);
        },
        removes() {
            this.$Modal.confirm({
                title  : '确认操作',
                content: '<p>你确认删除该记录吗?</p>',
                onOk   : () => {
                    this.axios({
                        url   : `http://localhost:3000/${this.module}/data/removes`,
                        method: 'post',
                        data  : {
                            ids: this.ids
                        }
                    }).then(res => {
                        this.getData();
                    });
                },
                onCancel: () => {
                    this.$Message.info('Clicked cancel');
                }
            });
        }
    },
    mounted() {
        this.getData();
    }
};
