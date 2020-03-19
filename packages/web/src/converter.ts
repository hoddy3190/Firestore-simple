import { firestore } from 'firebase/app'

import { HasId, OmitId, WebEncodable, WebDecodable, OptionalIdStorable, Storable } from './types'
import { Optional } from 'utility-types'

export class WebConverter<T extends HasId, S = OmitId<T>> {
  private _encode?: WebEncodable<T, S>
  private _decode?: WebDecodable<T, S>

  constructor ({ encode, decode }: {
    encode?: WebEncodable<T, S>,
    decode?: WebDecodable<T, S>,
  }) {
    this._encode = encode
    this._decode = decode
  }

  decode (documentSnapshot: firestore.DocumentSnapshot): T {
    const obj = { id: documentSnapshot.id, ...documentSnapshot.data() }
    if (this._decode) return this._decode(obj as S & HasId)

    return obj as T
  }

  encode (obj: OptionalIdStorable<T>): Optional<Storable<T>, 'id'> | Storable<S> {
    if (this._encode) return this._encode(obj)

    const doc = { ...obj }
    if ('id' in doc) delete doc.id
    return doc
  }
}