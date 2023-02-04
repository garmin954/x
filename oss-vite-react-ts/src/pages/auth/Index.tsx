import React, { Component } from 'react'
import {Descriptions} from 'antd'
// export default function Auth() {
    
    // return (
    //     <Descriptions title={'Auth Page'}>
    //     </Descriptions>
    // )
// }

export default class Auth extends React.Component{
    constructor(props: {} | Readonly<{}>){
        super(props)

        this.setState = {
            name: ''
        }
    }
    componentWillMount(): void {
        console.log('componentWillMount');
    }

    getDerivedStateFromProps(props){
        console.log('getDerivedStateFromProps', props);
        
    }
    
    render(): React.ReactNode {
        console.log('render');
        
        return (
            <Descriptions title={'Auth Page'}>
            </Descriptions>
        ) 
    }

}