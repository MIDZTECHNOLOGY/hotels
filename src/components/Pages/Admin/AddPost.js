import React, {Component} from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import * as AdminActions from '../../../store/action/adminActions';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@mui/material';
import { withFormik, Form, Field} from "formik";
import * as Yup from 'yup';
import { TextField, Select, } from 'formik-mui';
import { FormikTextField, FormikSelectField } from 'formik-material-fields';
import { Button, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image'
import { withRouter } from 'react-router-dom';
import API from '../../../utils/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


/* global $ */
const styles = theme => ({
    container1: {
        margin: theme.spacing(3),
        display: 'flex',
        flexDirection: 'row wrap',
        width: '100%'
    },
    postImage: {
        width: '100%'
    },
    Save: {
        marginBottom: theme.spacing(3)
    },
    formControl: {
        margin: theme.spacing(1)
    },
    leftSide: {
        flex: 4,
        height: '100%',  
        margin: theme.spacing(1),
        padding: theme.spacing(3)
    },
    rightSide: {
        flex: 2,
        height: '100%',
        margin: theme.spacing(1),
        padding: theme.spacing(3)
    }
})

class AddPost extends Component {
    componentDidUpdate(props, state){
        if(this.props.match.params.view === 'add' && this.props.admin.posts.filter(p => p.title === this.props.values.title).length > 0){
            const post = this.props.admin.posts.filter(p => p.title === this.props.values.title)[0];
            this.props.history.push('/admin/posts/edit/' + post.id);

        }
        if(this.props.admin.post.id !== props.admin.post.id){
            this.props.setValues(this.props.admin.post);
        }
    }

    uploadImage = (e) => {
        const data = new FormData();
        data.append('file', e.target.files[0], new Date().getTime().toString() + e.target.files[0].name);
        this.props.uploadImage(data, this.props.auth.token, this.props.admin.post.id, this.props.auth.user.userId)
    }

    componentDidMount(props, state){
        if(this.props.match.params.view === 'edit' && this.props.match.params.id){
            this.props.getSinglePost(this.props.match.params.id, this.props.auth.token);
        }
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'size': ['small', 'medium', 'large', 'huge']}],
            [{'color': []}, {'background': []}],
            ['image'],
            ['clean']
        ]
    }

    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote', 'script',
        'list', 'bullet', 'indent',
        'link', 'image', 'color', 'code-block'
    ]

    render(){
        const { classes } = this.props;
        return(
            <div>
                <Form   className={classes.container1}>
                    <Paper className={classes.leftSide}>
                        <FormikTextField
                            name="title"
                            label="Title"
                            margin="normal"
                            onChange={e => this.props.setFieldValue('slug', e.target.value.toLowerCase().replace(/ /g, '_'))}
                            fullWidth
                        />
                        <FormikTextField
                            name="slug"
                            label="Slug"
                            margin="normal"
                        />
                        <ReactQuill
                            value={this.props.values.content}
                            modules={this.modules}
                            formats={this.formats}
                            placeholder='Write some cool stuff'
                            onChange={val => this.props.setFieldValue('content', val)}
                        />
                    </Paper>
                    <Paper className={classes.rightSide}>
                        <Field
                            component={Select}
                            type="text"
                            name="status"
                            label="Status"
                            variant="standard"
                            sx={{m: 1, minWidth: '500px'}}
                        >
                            <MenuItem value={false}>Unpublished</MenuItem>
                            <MenuItem value={true}>Published</MenuItem>
                        </Field>
                        <div className={classes.Save}>
                            <Button 
                                variant='contained' 
                                color='secondary'
                                onClick={e => {
                                    this.props.handleSubmit();
                                }}
                            >
                                <SaveIcon />Save
                            </Button>
                        </div>
                        {this.props.admin.post.PostImage ?
                            this.props.admin.post.PostImage.length > 0 ?
                           <img src={API.makeFileUrl(this.props.admin.post.PostImage[0].url, this.props.auth.token)} className={classes.postImage} />
                            : null
                        : null}
                        <div>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={e => {
                                    $('.MyFile').trigger('click');
                                }}
                            >
                            <ImageIcon /> Upload Post Image
                            </Button>
                            <input type="file" style={{display: 'none'}} className='MyFile' onChange={this.uploadImage}/>
                        </div>
                    </Paper>
                </Form>
            </div>
        )   
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    admin: state.admin
}); 

const mapDispatchToProps = dispatch => ({
    addPost: (post, token) => {
        dispatch(AdminActions.addPost(post, token));
    },
    updatePost: (post, token) => {
        dispatch(AdminActions.updatePost(post, token));
    },
    getSinglePost: (id, token) => {
        dispatch(AdminActions.getSinglePost(id, token));
    },
    uploadImage: (data, token, postId, userId) => {
        dispatch(AdminActions.uploadImage(data, token, postId, userId));
    }
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(withFormik({
    mapPropsToValues: (props) => ({
        title: props.admin.post.title || '',
        slug: props.admin.post.slug || '',
        createdAt: props.admin.post.createdAt || '',
        status: props.admin.post.status || '',
        content: props.admin.post.content || '',
    }),
    validationSchema: Yup.object().shape({
        title: Yup.string().required('Title is required'),
        slug: Yup.string().required(),
        content: Yup.string().required()
    }),
    handleSubmit: (values, {setSubmitting, props}) => {
        console.log('Saving', props.addPost);
        if(props.match.params.view === 'edit'){
            const post = {
                ...values,
                id: props.match.params.id

            }
            props.updatePost(post, props.auth.token);
        }else{
            props.addPost(values, props.auth.token);
        }
    }
})(withStyles(styles)(AddPost))));