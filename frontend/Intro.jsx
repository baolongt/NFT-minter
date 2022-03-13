import React, { useEffect, useState } from "react"
import { minter, canisterId } from "canisters/minter"
import { canisterId as frontend } from "canisters/assets"
import logo from "./assets/logo-dark.svg"
import { Principal } from "@dfinity/principal"
import PlugConnect from "@psychedelic/plug-connect"
export function Intro() {
  const [uri, setUri] = useState()
  const [principal, setPrincipal] = useState(null)
  const [collection, setCollection] = useState([])
  const mint = async () => {
    const nftId = await minter.mint_principal(
      uri,
      Principal.fromText(principal),
    )
    console.log(nftId)
  }
  const getOwnerOf = async () => {
    const collection = await minter.getAll(Principal.fromText(principal))
    setCollection(collection)
  }
  return (
    <>
      {principal == null ? (
        <PlugConnect
          whitelist={[`${canisterId}`, `${frontend}`]}
          onConnectCallback={async () => {
            let p = await window.ic.plug.agent.getPrincipal()
            setPrincipal(p.toString())
          }}
        />
      ) : (
        <></>
      )}

      <div className="offset-4 col-4 d-flex flex-column">
        <div className="mb-3 row">
          <label className="col-sm-2 form-label">URI:</label>
          <div className="col-10">
            <input
              class="form-control"
              type="text"
              onChange={(e) => setUri(e.target.value)}
            />
          </div>
        </div>
        {principal == null ? (
          <button className={`btn btn-primary`} disable>
            Mint
          </button>
        ) : (
          <button className={`btn btn-primary`} onClick={() => mint()}>
            Mint
          </button>
        )}
      </div>
      <div className="mt-3">
        <p className="h3">Your NFT</p>
        <button class="btn btn-danger" onClick={() => getOwnerOf()}>
          Reload
        </button>
        <div class="col-12">
          {collection.map((c, i) => {
            return <img class="rounded col-3 m-2" key={i} src={`${c}`} />
          })}
        </div>
      </div>
    </>
  )
}
