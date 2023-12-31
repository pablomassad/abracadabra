import firebase from 'firebase/compat/app'
import { getMessaging } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, onSnapshot, collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc, setDoc, query, where, orderBy } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { ENVIRONMENTS } from 'src/environments'

const firebaseApp = initializeApp(ENVIRONMENTS.firebase)

const db = getFirestore()
const sto = getStorage()
const auth = getAuth()

const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}
const logout = async () => {
    return auth.signOut()
}
const register = async (name, email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })
    return user.uid
}
const addQuote = (quote) => {
    if (!auth.currentUser) {
        return alert('Not Authorized')
    }
    return db.doc(`usersX/${auth.currentUser.id}`).set({ quote })
}
const isInitialized = async () => {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(() => {
            resolve(true)
        })
    })
}
const getCurrentUser = async () => {
    return auth.currentUser
}
const getCurrentUserQuote = async () => {
    const quote = await db
        .doc(`usersX/${auth.currentUser.uid}`)
        .get()
    return quote.get('quote')
}
const getCollection = async (colName) => {
    const col = collection(db, colName)
    const colSnapshot = await getDocs(col)
    const result = colSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    return result
}
const getCollectionFlex = async (colName, ops) => {
    let q
    let operator = '=='
    if (ops.op) operator = ops.op
    if (ops.field && ops.sortField) {
        q = query(collection(db, colName), where(ops.field, operator, ops.val), orderBy(ops.field, 'asc'), orderBy(ops.sortField, ops.sortDir))
    }
    if (ops.field && !ops.sortField) {
        q = query(collection(db, colName), where(ops.field, operator, ops.val))
    }
    if (!ops.field && ops.sortField) {
        q = query(collection(db, colName), orderBy(ops.sortField, ops.sortDir))
    }
    if (!ops.field && !ops.sortField) {
        q = query(collection(db, colName))
    }
    const querySnapshot = await getDocs(q)
    const result = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    return result
}
const getCollectionRef = (colName) => {
    const colRef = collection(db, colName)
    return colRef
}
const getDocument = async (col, d) => {
    const docRef = doc(db, col, d)
    const sn = await getDoc(docRef)
    const result = sn.data()
    return result
}
const addDocument = async (col, d) => {
    const colRef = collection(db, col)
    const docRef = await addDoc(colRef, d)
    return docRef
}
const setDocument = async (col, d, id) => {
    let docRef
    if (id) {
        const docRef = doc(db, col, id)
        await setDoc(docRef, d, { merge: true }).then(() => {
            console.log('Document has been added successfully')
        }).catch(error => {
            console.log(error)
        })
    } else {
        const ref = collection(db, col)
        removeUndefinedFields(d)
        await addDoc(ref, d)
    }
    return true
}
const deleteDocument = async (col, id) => {
    const docRef = doc(db, col, id)
    await deleteDoc(docRef)
}
const uploadFile = (dest, f) => {
    const storageRef = ref(sto, dest)
    const uploadTask = uploadBytesResumable(storageRef, f)
    return uploadTask
}
const sendMessage = async (dest, titulo, descripcion) => {
    const message = {
        title: titulo,
        body: descripcion,
        data: {},
        topic: dest
    }
    try {
        await getMessaging().send(message)
        return true
    } catch (error) {
        return false
    }
}
const fb = {
    db,
    sto,
    auth,
    login,
    logout,
    register,
    addQuote,
    onSnapshot,
    getDownloadURL,
    uploadFile,
    deleteObject,
    isInitialized,
    getCurrentUser,
    getCurrentUserQuote,
    getCollection,
    getCollectionRef,
    getCollectionFlex,
    getDocument,
    setDocument,
    addDocument,
    deleteDocument,
    sendMessage
}

export default fb

function removeUndefinedFields (data) {
    for (const key in data) {
        if (data[key] === undefined) {
            delete data[key]
        }
    }
    return data
}
