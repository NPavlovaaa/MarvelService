import './charList.scss';
import MarvelService from '../../services/MarvelService';
import { Component } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage'
import Spinner from '../spinner/Spinner';


class CharList extends Component{

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1544,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount(){
        this.onRequest()
    }

    onRequest = (offset) =>{
        this.onCharLisLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)

    }

    onCharLisLoading = () =>{
        this.setState({
            newItemLoading: true
        })
    }

    onError = () =>{
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharListLoaded = (newCharList) =>{
        let ended = false
        let last = false
        if (newCharList.length < 9){
            ended = true
        }


        this.setState(({charList, offset}) =>({
            charList: [...charList, ...newCharList],
            loading: false,
            offset: offset + 9,
            newItemLoading: false,
            charEnded: ended,
            lastChar: last
        }))
    }

    renderItems(arr){
        const items = arr.map((item) =>{
            let imgStyle = {'objectFit': 'cover'}
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return(
                <li className="char__item"
                    key={item.id}
                    onClick={() => {this.props.onCharSelected(item.id)}}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render(){
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    onClick={() => (this.onRequest(offset))}
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;