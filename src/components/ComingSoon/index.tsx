import React, { useRef, useEffect, useContext, useState } from 'react'
import { Info, BookOpen, Code, PieChart, MessageCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import useToggle from '../../hooks/useToggle'
import { darken } from 'polished'
import { NavLink } from 'react-router-dom'

import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => darken(0.05, theme.bg6)};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 10.125rem;
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  padding: 1rem 1rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2rem;
  right: -7rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  top: 2rem;
  right: 1rem;
`};
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text2)};
  }
`

export default function ComingSoonMenu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)
  const theme = useContext(ThemeContext)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  useEffect(() => {
    const handleClickOutside = e => {
      if (node.current?.contains(e.target) ?? false) {
        return
      }
      toggle()
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, toggle])

  return (
    <StyledMenu ref={node}>
      <StyledNavLink
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        id={`swap-nav-link`}
        to={''}
        aria-disabled={true}
      >
        IDO
      </StyledNavLink>
      {isHovered && <MenuFlyout>Coming Soon..</MenuFlyout>}
    </StyledMenu>
  )
}
